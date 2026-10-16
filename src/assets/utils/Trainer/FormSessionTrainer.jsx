
import { useEffect, useState } from "react";
import {
    Alert,
    Box,
    Card,
    CardActions,
    CardContent,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography,
    Button,
} from "@mui/material";
import { Add, DeleteOutline } from "@mui/icons-material";
import { UseTheme } from "../../Controllers/UseTheme";
import { ButtonX } from "../ButtonX";
import axios from "axios";

const API_URL = "http://localhost:5000/api/event/sessions";

const emptyTask = () => ({
    task_name: "",
    task_details: "",
    completion_rate: "",
    top_result: "",
});

export const FormSessionTrainer = ({ event, session, trainer, onClose, onUpdated, }) => {
    const theme = UseTheme();

    // Event at a Glance
    const [sessionTitle, setSessionTitle] = useState("");
    const [sessionDate, setSessionDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [sessionType, setSessionType] = useState("Workshop");
    const [attendees, setAttendees] = useState("");
    const [trainerNames, setTrainerNames] = useState("");

    // Session description
    const [sessionDetails, setSessionDetails] = useState("");

    // Student Engagement Snapshot
    const [totalStudents, setTotalStudents] = useState("");
    const [tasksCompleted, setTasksCompleted] = useState("");
    const [totalTasks, setTotalTasks] = useState("");
    const [activeParticipants, setActiveParticipants] = useState("");
    const [engagementScore, setEngagementScore] = useState("");
    const [attendanceRate, setAttendanceRate] = useState("");
    const [taskCompletionRate, setTaskCompletionRate] = useState("");

    // Tasks & Activities / Results & Outcomes
    const [tasks, setTasks] = useState([emptyTask()]);
    const [topPerformers, setTopPerformers] = useState("");
    const [overallPassRate, setOverallPassRate] = useState("");
    const [specialRecognition, setSpecialRecognition] = useState("");

    // Takeaways
    const [keyTakeaways, setKeyTakeaways] = useState("");

    // Moments in Pictures
    const [photos, setPhotos] = useState([]);

    const [loading, setLoading] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const collegeName =
        event?.college_name ||
        event?.college?.college_name ||
        "";

    const eventStartDate = event?.start_date?.slice(0, 10) || "";
    const eventEndDate = event?.end_date?.slice(0, 10) || "";

    const trainerName = trainer
        ? [trainer.fname, trainer.lname].filter(Boolean).join(" ")
        : "";

    const durationMinutes = (() => {
        if (!startTime || !endTime) return 0;

        const [sh, sm] = startTime.split(":").map(Number);
        const [eh, em] = endTime.split(":").map(Number);

        return eh * 60 + em - (sh * 60 + sm);
    })();

    const duration = durationMinutes > 0
        ? `${Math.floor(durationMinutes / 60) ? `${Math.floor(durationMinutes / 60)} hour${Math.floor(durationMinutes / 60) !== 1 ? "s" : ""}` : ""}${Math.floor(durationMinutes / 60) && durationMinutes % 60 ? " " : ""}${durationMinutes % 60 ? `${durationMinutes % 60} minutes` : ""}`
        : "";

    useEffect(() => {
        if (session) {
            setSessionTitle(session.session_title || "");
            setSessionDate(session.session_date?.slice(0, 10) || "");
            setStartTime(session.start_time?.slice(0, 5) || "");
            setEndTime(session.end_time?.slice(0, 5) || "");
            setSessionType(session.session_type || "Workshop");
            setAttendees(session.attendees ?? "");
            setTrainerNames(session.trainer_names || session.trainer_name || trainerName);
            setSessionDetails(session.session_details || "");

            setTotalStudents(session.total_students ?? "");
            setTasksCompleted(session.tasks_completed ?? "");
            setTotalTasks(session.total_tasks ?? "");
            setActiveParticipants(session.active_participants ?? "");
            setEngagementScore(session.engagement_score ?? "");
            setAttendanceRate(session.attendance_rate ?? "");
            setTaskCompletionRate(session.task_completion_rate ?? "");

            setTasks(
                Array.isArray(session.tasks) && session.tasks.length
                    ? session.tasks.map((task) => ({
                        task_name: task.task_name || "",
                        task_details: task.task_details || "",
                        completion_rate: task.completion_rate ?? "",
                        top_result: task.top_result || "",
                    }))
                    : [emptyTask()]
            );

            setTopPerformers(session.top_performers || "");
            setOverallPassRate(session.overall_pass_rate ?? "");
            setSpecialRecognition(session.special_recognition || "");
            setKeyTakeaways(session.key_takeaways || "");
            setPhotos([]);
        } else {
            setSessionTitle("");
            setSessionDate(eventStartDate);
            setStartTime("");
            setEndTime("");
            setSessionType(
                event?.event_type === "Course" ? "Orientation" : "Workshop"
            );
            setAttendees("");
            setTrainerNames(trainerName);
            setSessionDetails("");

            setTotalStudents("");
            setTasksCompleted("");
            setTotalTasks("");
            setActiveParticipants("");
            setEngagementScore("");
            setAttendanceRate("");
            setTaskCompletionRate("");

            setTasks([emptyTask()]);
            setTopPerformers("");
            setOverallPassRate("");
            setSpecialRecognition("");
            setKeyTakeaways("");
            setPhotos([]);
        }
    }, [session, event, eventStartDate, trainerName]);

    const handleCloseSnackbar = (_, reason) => {
        if (reason === "clickaway") return;
        setOpenSnackbar(false);
    };

    const updateTask = (index, field, value) => {
        setTasks((current) =>
            current.map((task, i) =>
                i === index ? { ...task, [field]: value } : task
            )
        );
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files || []);
        const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

        if (files.some((file) => !allowedTypes.includes(file.type))) {
            setError("Please upload JPG, PNG, or WEBP images only.");
            setSuccess("");
            setOpenSnackbar(true);
            e.target.value = "";
            return;
        }

        if (files.some((file) => file.size > 5 * 1024 * 1024)) {
            setError("Each image must be 5 MB or smaller.");
            setSuccess("");
            setOpenSnackbar(true);
            e.target.value = "";
            return;
        }

        setPhotos((current) => [...current, ...files]);
        e.target.value = "";
    };

    const handleSaveSession = async () => {
        if (loading) return;

        if (!event?.id) {
            setError("Event information is missing.");
            setSuccess("");
            setOpenSnackbar(true);
            return;
        }

        if (
            !sessionTitle.trim() ||
            !sessionDate ||
            !startTime ||
            !endTime ||
            !sessionType
        ) {
            setError("Please fill in all required session fields.");
            setSuccess("");
            setOpenSnackbar(true);
            return;
        }

        if (startTime >= endTime) {
            setError("End time must be later than start time.");
            setSuccess("");
            setOpenSnackbar(true);
            return;
        }

        if (
            (eventStartDate && sessionDate < eventStartDate) ||
            (eventEndDate && sessionDate > eventEndDate)
        ) {
            setError("Session date must be within the event dates.");
            setSuccess("");
            setOpenSnackbar(true);
            return;
        }

        const percentages = [
            ["Attendance Rate", attendanceRate],
            ["Task Completion Rate", taskCompletionRate],
            ["Overall Pass Rate", overallPassRate],
        ];

        for (const [label, value] of percentages) {
            if (value !== "" && (Number(value) < 0 || Number(value) > 100)) {
                setError(`${label} must be between 0 and 100.`);
                setSuccess("");
                setOpenSnackbar(true);
                return;
            }
        }

        if (
            engagementScore !== "" &&
            (Number(engagementScore) < 1 || Number(engagementScore) > 10)
        ) {
            setError("Engagement score must be between 1 and 10.");
            setSuccess("");
            setOpenSnackbar(true);
            return;
        }

        const validTasks = tasks.filter(
            (task) =>
                task.task_name.trim() ||
                task.task_details.trim() ||
                task.completion_rate !== "" ||
                task.top_result.trim()
        );

        for (const task of validTasks) {
            if (
                task.completion_rate !== "" &&
                (Number(task.completion_rate) < 0 ||
                    Number(task.completion_rate) > 100)
            ) {
                setError("Task completion rate must be between 0 and 100.");
                setSuccess("");
                setOpenSnackbar(true);
                return;
            }
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");

            if (!token) {
                setError("Your session has expired. Please log in again.");
                setOpenSnackbar(true);
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const encodedPhotos = await Promise.all(
                photos.map(
                    (file) =>
                        new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () =>
                                resolve({
                                    name: file.name,
                                    type: file.type,
                                    data: reader.result,
                                });
                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                        })
                )
            );

            const payload = {
                event_id: Number(event.id),
                session_title: sessionTitle.trim(),
                session_details: sessionDetails.trim(),
                session_date: sessionDate,
                start_time: startTime,
                end_time: endTime,

                session_type: sessionType,
                duration,
                college_name: collegeName,
                trainer_names: trainerNames.trim(),
                attendees: attendees === "" ? null : Number(attendees),

                total_students:
                    totalStudents === "" ? null : Number(totalStudents),
                tasks_completed:
                    tasksCompleted === "" ? null : Number(tasksCompleted),
                total_tasks: totalTasks === "" ? null : Number(totalTasks),
                active_participants:
                    activeParticipants === "" ? null : Number(activeParticipants),
                engagement_score:
                    engagementScore === "" ? null : Number(engagementScore),
                attendance_rate:
                    attendanceRate === "" ? null : Number(attendanceRate),
                task_completion_rate:
                    taskCompletionRate === "" ? null : Number(taskCompletionRate),

                tasks: validTasks.map((task) => ({
                    task_name: task.task_name.trim(),
                    task_details: task.task_details.trim(),
                    completion_rate:
                        task.completion_rate === ""
                            ? null
                            : Number(task.completion_rate),
                    top_result: task.top_result.trim(),
                })),

                top_performers: topPerformers.trim(),
                overall_pass_rate:
                    overallPassRate === "" ? null : Number(overallPassRate),
                special_recognition: specialRecognition.trim(),
                key_takeaways: keyTakeaways.trim(),
                session_photos: encodedPhotos,
            };

            const response = session?.id
                ? await axios.patch(
                    `${API_URL}/update/${session.id}`,
                    payload,
                    config
                )
                : await axios.post(
                    `${API_URL}/create/${event.id}`,
                    payload,
                    config
                );

            setSuccess(
                response.data.message ||
                (session?.id
                    ? "Session updated successfully."
                    : "Session created successfully.")
            );
            setOpenSnackbar(true);

            await onUpdated?.();

            setTimeout(() => onClose?.(), 1200);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                (session?.id
                    ? "Failed to update session."
                    : "Failed to create session.")
            );
            setSuccess("");
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container>
                <Grid size={12}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", }}>
                        <Card
                            variant="outlined"
                            sx={{
                                width: { lg: 650, md: 600, sm: 500, xs: "90vw", },
                                maxHeight: "90dvh",
                                overflowY: "auto",
                                bgcolor: theme.cardBg,
                                border: `solid 2px ${theme.cardBorder}`,
                                borderRadius: 3,
                                boxShadow: `0px 0px 8px 10px ${theme.shadow}`,
                                scrollbarWidth: "thin",
                                scrollbarColor: "transparent transparent",
                                "&::-webkit-scrollbar": {
                                    width: "6px",
                                },
                                "&::-webkit-scrollbar-track": {
                                    background: "transparent",
                                },
                                "&::-webkit-scrollbar-thumb": {
                                    background: "transparent",
                                    borderRadius: "10px",
                                },
                                "&:hover::-webkit-scrollbar-thumb": {
                                    background: theme.cardBorder,
                                },
                            }}
                        >
                            <CardContent sx={{ p: 3 }}>
                                <Typography
                                    sx={{
                                        color: theme.primaryText,
                                        fontWeight: "bolder",
                                        fontSize: 20,
                                        textAlign: "center",
                                        mb: 3,
                                    }}
                                >
                                    {session?.id
                                        ? "Edit Session Details"
                                        : "Add Session Details"}
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 3,
                                    }}
                                >
                                    <Box>
                                        <Typography
                                            sx={{
                                                color: theme.primaryText,
                                                fontWeight: "bold",
                                                mb: 2,
                                            }}
                                        >
                                            Event at a Glance
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 2,
                                            }}
                                        >
                                            <TextField
                                                label="College Name"
                                                value={collegeName}
                                                fullWidth
                                                disabled
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: theme.primaryText,
                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                    },
                                                    "& .MuiInputBase-input::placeholder": {
                                                        color: theme.secondaryText,
                                                        opacity: 1,
                                                    },
                                                }}
                                            />

                                            <TextField
                                                label="Session Title"
                                                value={sessionTitle}
                                                onChange={(e) =>
                                                    setSessionTitle(e.target.value)
                                                }
                                                required
                                                fullWidth
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: theme.primaryText,
                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                    },
                                                    "& .MuiInputBase-input::placeholder": {
                                                        color: theme.secondaryText,
                                                        opacity: 1,
                                                    },
                                                }}
                                            />

                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField
                                                        label="Date of Session"
                                                        type="date"
                                                        value={sessionDate}
                                                        onChange={(e) =>
                                                            setSessionDate(e.target.value)
                                                        }
                                                        slotProps={{
                                                            inputLabel: { shrink: true },
                                                            htmlInput: {
                                                                min: eventStartDate || undefined,
                                                                max: eventEndDate || undefined,
                                                            },
                                                        }}
                                                        required
                                                        fullWidth
                                                        sx={{
                                                            "& .MuiOutlinedInput-root": {
                                                                color: theme.primaryText,
                                                                "& .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: theme.primaryAccent,
                                                                    borderWidth: "2px",
                                                                },
                                                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: theme.primaryAccent,
                                                                    borderWidth: "2px",
                                                                },
                                                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: theme.primaryAccent,
                                                                    borderWidth: "2px",
                                                                },
                                                            },
                                                            "& .MuiInputBase-input::placeholder": {
                                                                color: theme.secondaryText,
                                                                opacity: 1,
                                                            },
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField
                                                        label="Duration"
                                                        value={duration}
                                                        fullWidth
                                                        disabled
                                                        sx={{
                                                            "& .MuiOutlinedInput-root": {
                                                                color: theme.primaryText,
                                                                "& .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: theme.primaryAccent,
                                                                    borderWidth: "2px",
                                                                },
                                                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: theme.primaryAccent,
                                                                    borderWidth: "2px",
                                                                },
                                                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: theme.primaryAccent,
                                                                    borderWidth: "2px",
                                                                },
                                                            },
                                                            "& .MuiInputBase-input::placeholder": {
                                                                color: theme.secondaryText,
                                                                opacity: 1,
                                                            },
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField
                                                        label="Start Time"
                                                        type="time"
                                                        value={startTime}
                                                        onChange={(e) =>
                                                            setStartTime(e.target.value)
                                                        }
                                                        slotProps={{
                                                            inputLabel: { shrink: true },
                                                        }}
                                                        required
                                                        fullWidth
                                                        sx={{
                                                            "& .MuiOutlinedInput-root": {
                                                                color: theme.primaryText,
                                                                "& .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: theme.primaryAccent,
                                                                    borderWidth: "2px",
                                                                },
                                                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: theme.primaryAccent,
                                                                    borderWidth: "2px",
                                                                },
                                                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: theme.primaryAccent,
                                                                    borderWidth: "2px",
                                                                },
                                                            },
                                                            "& .MuiInputBase-input::placeholder": {
                                                                color: theme.secondaryText,
                                                                opacity: 1,
                                                            },
                                                        }}
                                                    />
                                                </Grid>

                                                <Grid size={{ xs: 12, sm: 6 }}>
                                                    <TextField
                                                        label="End Time"
                                                        type="time"
                                                        value={endTime}
                                                        onChange={(e) =>
                                                            setEndTime(e.target.value)
                                                        }
                                                        slotProps={{
                                                            inputLabel: { shrink: true },
                                                        }}
                                                        required
                                                        fullWidth
                                                        sx={{
                                                            "& .MuiOutlinedInput-root": {
                                                                color: theme.primaryText,
                                                                "& .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: theme.primaryAccent,
                                                                    borderWidth: "2px",
                                                                },
                                                                "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: theme.primaryAccent,
                                                                    borderWidth: "2px",
                                                                },
                                                                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                    borderColor: theme.primaryAccent,
                                                                    borderWidth: "2px",
                                                                },
                                                            },
                                                            "& .MuiInputBase-input::placeholder": {
                                                                color: theme.secondaryText,
                                                                opacity: 1,
                                                            },
                                                        }}
                                                    />
                                                </Grid>
                                            </Grid>

                                            <FormControl fullWidth required>
                                                <InputLabel sx={{
                                                    color: theme.secondaryText,
                                                    "&.Mui-focused": {
                                                        color: theme.primaryAccent,
                                                    },
                                                }}>Session Type</InputLabel>
                                                <Select
                                                    label="Session Type"
                                                    value={sessionType}
                                                    onChange={(e) =>
                                                        setSessionType(e.target.value)
                                                    }
                                                    MenuProps={{
                                                        PaperProps: {
                                                            sx: {
                                                                bgcolor: theme.cardBg,
                                                                border: `1px solid ${theme.cardBorder}`,
                                                                "& .MuiMenuItem-root": {
                                                                    color: theme.primaryText,
                                                                    "&:hover": {
                                                                        bgcolor: theme.background,
                                                                    },
                                                                    "&.Mui-selected": {
                                                                        bgcolor: theme.primaryAccent,
                                                                        color: theme.selectText,
                                                                    },
                                                                    "&.Mui-selected:hover": {
                                                                        bgcolor: theme.primaryAccent,
                                                                    },
                                                                },
                                                            },
                                                        },
                                                    }}
                                                    sx={{
                                                        color: theme.primaryText,
                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                        },
                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                        },
                                                        "& .MuiSvgIcon-root": {
                                                            color: theme.secondaryText,
                                                        },
                                                    }}
                                                >
                                                    <MenuItem value="Orientation">
                                                        Orientation
                                                    </MenuItem>
                                                    <MenuItem value="Workshop">
                                                        Workshop
                                                    </MenuItem>
                                                    <MenuItem value="Seminar">
                                                        Seminar
                                                    </MenuItem>
                                                    <MenuItem value="Course">
                                                        Course
                                                    </MenuItem>
                                                </Select>
                                            </FormControl>

                                            <TextField
                                                label="Attendees (students and faculty)"
                                                type="number"
                                                value={attendees}
                                                onChange={(e) =>
                                                    setAttendees(e.target.value)
                                                }
                                                slotProps={{
                                                    htmlInput: { min: 0 },
                                                }}
                                                fullWidth
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: theme.primaryText,
                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                    },
                                                    "& .MuiInputBase-input::placeholder": {
                                                        color: theme.secondaryText,
                                                        opacity: 1,
                                                    },
                                                }}
                                            />

                                            <TextField
                                                label="Azentra Trainer(s)"
                                                value={trainerNames}
                                                onChange={(e) =>
                                                    setTrainerNames(e.target.value)
                                                }
                                                fullWidth
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: theme.primaryText,
                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                    },
                                                    "& .MuiInputBase-input::placeholder": {
                                                        color: theme.secondaryText,
                                                        opacity: 1,
                                                    },
                                                }}
                                            />

                                            <TextField
                                                label="Session Highlights / Description"
                                                value={sessionDetails}
                                                onChange={(e) =>
                                                    setSessionDetails(e.target.value)
                                                }
                                                multiline
                                                minRows={3}
                                                fullWidth
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: theme.primaryText,
                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                    },
                                                    "& .MuiInputBase-input::placeholder": {
                                                        color: theme.secondaryText,
                                                        opacity: 1,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    {/* Student Engagement Snapshot */}
                                    <Box>
                                        <Typography
                                            sx={{
                                                color: theme.primaryText,
                                                fontWeight: "bold",
                                                mb: 2,
                                            }}
                                        >
                                            Student Engagement Snapshot
                                        </Typography>

                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Total Students"
                                                    type="number"
                                                    value={totalStudents}
                                                    onChange={(e) =>
                                                        setTotalStudents(e.target.value)
                                                    }
                                                    slotProps={{
                                                        htmlInput: { min: 0 },
                                                    }}
                                                    fullWidth
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            color: theme.primaryText,
                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                        },
                                                        "& .MuiInputBase-input::placeholder": {
                                                            color: theme.secondaryText,
                                                            opacity: 1,
                                                        },
                                                    }}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Active Participants"
                                                    type="number"
                                                    value={activeParticipants}
                                                    onChange={(e) =>
                                                        setActiveParticipants(e.target.value)
                                                    }
                                                    slotProps={{
                                                        htmlInput: { min: 0 },
                                                    }}
                                                    fullWidth
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            color: theme.primaryText,
                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                        },
                                                        "& .MuiInputBase-input::placeholder": {
                                                            color: theme.secondaryText,
                                                            opacity: 1,
                                                        },
                                                    }}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Tasks Completed"
                                                    type="number"
                                                    value={tasksCompleted}
                                                    onChange={(e) =>
                                                        setTasksCompleted(e.target.value)
                                                    }
                                                    slotProps={{
                                                        htmlInput: { min: 0 },
                                                    }}
                                                    fullWidth
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            color: theme.primaryText,
                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                        },
                                                        "& .MuiInputBase-input::placeholder": {
                                                            color: theme.secondaryText,
                                                            opacity: 1,
                                                        },
                                                    }}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Total Tasks"
                                                    type="number"
                                                    value={totalTasks}
                                                    onChange={(e) =>
                                                        setTotalTasks(e.target.value)
                                                    }
                                                    slotProps={{
                                                        htmlInput: { min: 0 },
                                                    }}
                                                    fullWidth
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            color: theme.primaryText,
                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                        },
                                                        "& .MuiInputBase-input::placeholder": {
                                                            color: theme.secondaryText,
                                                            opacity: 1,
                                                        },
                                                    }}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Average Engagement Score (1–10)"
                                                    type="number"
                                                    value={engagementScore}
                                                    onChange={(e) =>
                                                        setEngagementScore(e.target.value)
                                                    }
                                                    slotProps={{
                                                        htmlInput: {
                                                            min: 1,
                                                            max: 10,
                                                            step: 0.1,
                                                        },
                                                    }}
                                                    fullWidth
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            color: theme.primaryText,
                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                        },
                                                        "& .MuiInputBase-input::placeholder": {
                                                            color: theme.secondaryText,
                                                            opacity: 1,
                                                        },
                                                    }}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Attendance Rate (%)"
                                                    type="number"
                                                    value={attendanceRate}
                                                    onChange={(e) =>
                                                        setAttendanceRate(e.target.value)
                                                    }
                                                    slotProps={{
                                                        htmlInput: {
                                                            min: 0,
                                                            max: 100,
                                                        },
                                                    }}
                                                    fullWidth
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            color: theme.primaryText,
                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                        },
                                                        "& .MuiInputBase-input::placeholder": {
                                                            color: theme.secondaryText,
                                                            opacity: 1,
                                                        },
                                                    }}
                                                />
                                            </Grid>

                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <TextField
                                                    label="Task Completion Rate (%)"
                                                    type="number"
                                                    value={taskCompletionRate}
                                                    onChange={(e) =>
                                                        setTaskCompletionRate(e.target.value)
                                                    }
                                                    slotProps={{
                                                        htmlInput: {
                                                            min: 0,
                                                            max: 100,
                                                        },
                                                    }}
                                                    fullWidth
                                                    sx={{
                                                        "& .MuiOutlinedInput-root": {
                                                            color: theme.primaryText,
                                                            "& .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                            "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                borderColor: theme.primaryAccent,
                                                                borderWidth: "2px",
                                                            },
                                                        },
                                                        "& .MuiInputBase-input::placeholder": {
                                                            color: theme.secondaryText,
                                                            opacity: 1,
                                                        },
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    {/* Tasks & Activities */}
                                    <Box>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                mb: 2,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: theme.primaryText,
                                                    fontWeight: "bold",
                                                }}
                                            >
                                                Tasks & Activities / Results & Outcomes
                                            </Typography>

                                            <Button
                                                startIcon={<Add />}
                                                onClick={() =>
                                                    setTasks((current) => [
                                                        ...current,
                                                        emptyTask(),
                                                    ])
                                                }
                                                sx={{ color: theme.primaryText }}
                                            >
                                                Add Task
                                            </Button>
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 2,
                                            }}
                                        >
                                            {tasks.map((task, index) => (
                                                <Card
                                                    key={index}
                                                    variant="outlined"
                                                    sx={{
                                                        bgcolor: theme.background,
                                                        borderColor: theme.cardBorder,
                                                        borderRadius: 2,
                                                    }}
                                                >
                                                    <CardContent>
                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                justifyContent: "space-between",
                                                                alignItems: "center",
                                                                mb: 2,
                                                            }}
                                                        >
                                                            <Typography
                                                                sx={{
                                                                    color: theme.primaryText,
                                                                    fontWeight: "bold",
                                                                }}
                                                            >
                                                                Task {index + 1}
                                                            </Typography>

                                                            {tasks.length > 1 && (
                                                                <Button
                                                                    color="error"
                                                                    size="small"
                                                                    startIcon={<DeleteOutline />}
                                                                    onClick={() =>
                                                                        setTasks((current) =>
                                                                            current.filter(
                                                                                (_, i) => i !== index
                                                                            )
                                                                        )
                                                                    }
                                                                >
                                                                    Remove
                                                                </Button>
                                                            )}
                                                        </Box>

                                                        <Box
                                                            sx={{
                                                                display: "flex",
                                                                flexDirection: "column",
                                                                gap: 2,
                                                            }}
                                                        >
                                                            <TextField
                                                                label="Task / Activity Name"
                                                                value={task.task_name}
                                                                onChange={(e) =>
                                                                    updateTask(
                                                                        index,
                                                                        "task_name",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                fullWidth
                                                                sx={{
                                                                    "& .MuiOutlinedInput-root": {
                                                                        color: theme.primaryText,
                                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: theme.primaryAccent,
                                                                            borderWidth: "2px",
                                                                        },
                                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: theme.primaryAccent,
                                                                            borderWidth: "2px",
                                                                        },
                                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: theme.primaryAccent,
                                                                            borderWidth: "2px",
                                                                        },
                                                                    },
                                                                    "& .MuiInputBase-input::placeholder": {
                                                                        color: theme.secondaryText,
                                                                        opacity: 1,
                                                                    },
                                                                }}
                                                            />

                                                            <TextField
                                                                label="Task Details / Activity Description"
                                                                value={task.task_details}
                                                                onChange={(e) =>
                                                                    updateTask(
                                                                        index,
                                                                        "task_details",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                multiline
                                                                minRows={2}
                                                                fullWidth
                                                                sx={{
                                                                    "& .MuiOutlinedInput-root": {
                                                                        color: theme.primaryText,
                                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: theme.primaryAccent,
                                                                            borderWidth: "2px",
                                                                        },
                                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: theme.primaryAccent,
                                                                            borderWidth: "2px",
                                                                        },
                                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: theme.primaryAccent,
                                                                            borderWidth: "2px",
                                                                        },
                                                                    },
                                                                    "& .MuiInputBase-input::placeholder": {
                                                                        color: theme.secondaryText,
                                                                        opacity: 1,
                                                                    },
                                                                }}
                                                            />

                                                            <TextField
                                                                label="Completion Rate (%)"
                                                                type="number"
                                                                value={task.completion_rate}
                                                                onChange={(e) =>
                                                                    updateTask(
                                                                        index,
                                                                        "completion_rate",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                slotProps={{
                                                                    htmlInput: {
                                                                        min: 0,
                                                                        max: 100,
                                                                    },
                                                                }}
                                                                fullWidth
                                                                sx={{
                                                                    "& .MuiOutlinedInput-root": {
                                                                        color: theme.primaryText,
                                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: theme.primaryAccent,
                                                                            borderWidth: "2px",
                                                                        },
                                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: theme.primaryAccent,
                                                                            borderWidth: "2px",
                                                                        },
                                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: theme.primaryAccent,
                                                                            borderWidth: "2px",
                                                                        },
                                                                    },
                                                                    "& .MuiInputBase-input::placeholder": {
                                                                        color: theme.secondaryText,
                                                                        opacity: 1,
                                                                    },
                                                                }}
                                                            />

                                                            <TextField
                                                                label="Top Score / Result"
                                                                value={task.top_result}
                                                                onChange={(e) =>
                                                                    updateTask(
                                                                        index,
                                                                        "top_result",
                                                                        e.target.value
                                                                    )
                                                                }
                                                                placeholder="e.g. Top team: 98/100"
                                                                fullWidth
                                                                sx={{
                                                                    "& .MuiOutlinedInput-root": {
                                                                        color: theme.primaryText,
                                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: theme.primaryAccent,
                                                                            borderWidth: "2px",
                                                                        },
                                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: theme.primaryAccent,
                                                                            borderWidth: "2px",
                                                                        },
                                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                                            borderColor: theme.primaryAccent,
                                                                            borderWidth: "2px",
                                                                        },
                                                                    },
                                                                    "& .MuiInputBase-input::placeholder": {
                                                                        color: theme.secondaryText,
                                                                        opacity: 1,
                                                                    },
                                                                }}
                                                            />
                                                        </Box>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </Box>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 2,
                                                mt: 2,
                                            }}
                                        >
                                            <TextField
                                                label="Top Performer(s)"
                                                value={topPerformers}
                                                onChange={(e) =>
                                                    setTopPerformers(e.target.value)
                                                }
                                                placeholder="Name(s), college/department, or team"
                                                multiline
                                                minRows={2}
                                                fullWidth
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: theme.primaryText,
                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                    },
                                                    "& .MuiInputBase-input::placeholder": {
                                                        color: theme.secondaryText,
                                                        opacity: 1,
                                                    },
                                                }}
                                            />

                                            <TextField
                                                label="Overall Pass Rate (%)"
                                                type="number"
                                                value={overallPassRate}
                                                onChange={(e) =>
                                                    setOverallPassRate(e.target.value)
                                                }
                                                slotProps={{
                                                    htmlInput: {
                                                        min: 0,
                                                        max: 100,
                                                    },
                                                }}
                                                fullWidth
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: theme.primaryText,
                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                    },
                                                    "& .MuiInputBase-input::placeholder": {
                                                        color: theme.secondaryText,
                                                        opacity: 1,
                                                    },
                                                }}
                                            />

                                            <TextField
                                                label="Special Recognition"
                                                value={specialRecognition}
                                                onChange={(e) =>
                                                    setSpecialRecognition(e.target.value)
                                                }
                                                multiline
                                                minRows={2}
                                                fullWidth
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: theme.primaryText,
                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                    },
                                                    "& .MuiInputBase-input::placeholder": {
                                                        color: theme.secondaryText,
                                                        opacity: 1,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                    <Box>
                                        <Typography
                                            sx={{
                                                color: theme.primaryText,
                                                fontWeight: "bold",
                                                mb: 2,
                                            }}
                                        >
                                            Takeaways
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: 2,
                                            }}
                                        >
                                            <TextField
                                                label="Key Takeaways for the College"
                                                value={keyTakeaways}
                                                onChange={(e) =>
                                                    setKeyTakeaways(e.target.value)
                                                }
                                                placeholder="Learning gained, skills demonstrated, next steps, follow-up actions"
                                                multiline
                                                minRows={3}
                                                fullWidth
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: theme.primaryText,
                                                        "& .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&:hover .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                    },
                                                    "& .MuiInputBase-input::placeholder": {
                                                        color: theme.secondaryText,
                                                        opacity: 1,
                                                    },
                                                }}
                                            />
                                        </Box>
                                    </Box>

                                    {/* Moments in Pictures */}
                                    <Box>
                                        <Typography
                                            sx={{
                                                color: theme.primaryText,
                                                fontWeight: "bold",
                                                mb: 1,
                                            }}
                                        >
                                            Moments in Pictures
                                        </Typography>

                                        <Typography
                                            sx={{
                                                color: theme.secondaryText,
                                                fontSize: 13,
                                                mb: 2,
                                            }}
                                        >
                                            Upload session photos for the event report.
                                            JPG, PNG, or WEBP; maximum 5 MB per image.
                                        </Typography>

                                        <Button
                                            component="label"
                                            variant="outlined"
                                            sx={{
                                                color: theme.primaryText,
                                                borderColor: theme.cardBorder,
                                                "&:hover": {
                                                    borderColor: theme.primaryAccent,
                                                },
                                            }}
                                        >
                                            Upload Photos
                                            <input
                                                type="file"
                                                hidden
                                                multiple
                                                accept="image/jpeg,image/png,image/webp"
                                                onChange={handlePhotoChange}
                                            />
                                        </Button>

                                        {photos.map((photo, index) => (
                                            <Box
                                                key={`${photo.name}-${index}`}
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "space-between",
                                                    gap: 1,
                                                    mt: 1,
                                                }}
                                            >
                                                <Typography
                                                    sx={{
                                                        color: theme.primaryText,
                                                        fontSize: 13,
                                                        overflowWrap: "anywhere",
                                                    }}
                                                >
                                                    {photo.name}
                                                </Typography>

                                                <Button
                                                    size="small"
                                                    color="error"
                                                    onClick={() =>
                                                        setPhotos((current) =>
                                                            current.filter(
                                                                (_, i) => i !== index
                                                            )
                                                        )
                                                    }
                                                >
                                                    Remove
                                                </Button>
                                            </Box>
                                        ))}
                                    </Box>

                                    <Typography
                                        sx={{
                                            color: theme.secondaryText,
                                            fontSize: 12,
                                            textAlign: "center",
                                        }}
                                    >
                                        Azentra Global — Empowering the next
                                        generation through technology, training,
                                        and transformation.
                                    </Typography>
                                </Box>
                            </CardContent>

                            <CardActions
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: 1,
                                    pb: 3,
                                }}
                            >
                                <ButtonX
                                    name="Cancel"
                                    onClick={() => {
                                        if (!loading) onClose?.();
                                    }}
                                />

                                <ButtonX
                                    name={
                                        loading
                                            ? "Saving..."
                                            : session?.id
                                                ? "Update Session"
                                                : "Save Session"
                                    }
                                    onClick={handleSaveSession}
                                />
                            </CardActions>
                        </Card>
                    </Box>
                </Grid>
            </Grid>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    variant="filled"
                    severity={error ? "error" : "success"}
                    sx={{
                        backgroundColor: error
                            ? theme.error
                            : theme.success,
                    }}
                >
                    {error || success}
                </Alert>
            </Snackbar>
        </Box>
    );
};
