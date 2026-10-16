import { useEffect, useState } from "react";
import { Alert, Box, Card, CardActions, CardContent, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Snackbar, Switch, TextField, Typography, } from "@mui/material";
import { UseTheme } from "../../Controllers/UseTheme";
import { ButtonX } from "../ButtonX";
import axios from "axios";

export const FormEventAdmin = ({ event, onClose, onUpdated, colleges = [], departments = [], trainers = [] }) => {
    const theme = UseTheme();

    const [eventName, setEventName] = useState("");
    const [eventType, setEventType] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [collegeId, setCollegeId] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [trainerId, setTrainerId] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [registrationRequired, setRegistrationRequired] = useState(false);
    const [eventStatus, setEventStatus] = useState("Draft");

    const [loading, setLoading] = useState(false);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleCloseSnackbar = (_, reason) => {
        if (reason === "clickaway") return;
        setOpenSnackbar(false);
    };

    useEffect(() => {
        if (event) {
            setEventName(event.event_name || "");
            setEventType(event.event_type || "");
            setEventDescription(event.event_description || "");
            setCollegeId(event.college_id ?? "");
            setDepartmentId(event.department_id ?? "");
            setTrainerId(event.trainer_id ?? "");
            setStartDate(event.start_date?.slice(0, 10) || "");
            setEndDate(event.end_date?.slice(0, 10) || "");
            setRegistrationRequired(
                event.registration_required ?? false
            );
            setEventStatus(event.event_status || "Draft");
        } else {
            setEventName("");
            setEventType("");
            setEventDescription("");
            setCollegeId("");
            setDepartmentId("");
            setTrainerId("");
            setStartDate("");
            setEndDate("");
            setRegistrationRequired(false);
            setEventStatus("Draft");
        }
    }, [event]);

    const resetForm = () => {
        setEventName("");
        setEventType("");
        setEventDescription("");
        setCollegeId("");
        setDepartmentId("");
        setTrainerId("");
        setStartDate("");
        setEndDate("");
        setRegistrationRequired(false);
        setEventStatus("Draft");
    };

    const handleSaveEvent = async () => {
        if (loading) return;
        if (
            !eventName.trim() ||
            !eventType ||
            !collegeId ||
            !startDate ||
            !endDate
        ) {
            setError("Please fill in all required fields");
            setSuccess("");
            setOpenSnackbar(true);
            return;
        }

        if (startDate > endDate) {
            setError("End date cannot be before the start date");
            setSuccess("");
            setOpenSnackbar(true);
            return;
        }

        const payload = {
            event_name: eventName.trim(),
            event_type: eventType,
            event_description: eventDescription.trim(),
            college_id: Number(collegeId),
            department_id: departmentId
                ? Number(departmentId)
                : null,
            trainer_id: trainerId ? Number(trainerId) : null,
            start_date: startDate,
            end_date: endDate,
            registration_required: registrationRequired,
            event_status: eventStatus,
        };

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const token = localStorage.getItem("token") || sessionStorage.getItem("token");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = event?.id
                ? await axios.patch(
                    `http://localhost:5000/api/events/update/${event.id}`,
                    payload,
                    config
                )
                : await axios.post(
                    "http://localhost:5000/api/events/create",
                    payload,
                    config
                );

            setSuccess(
                response.data.message ||
                (event?.id
                    ? "Event updated successfully"
                    : "Event created successfully")
            );
            setOpenSnackbar(true);

            await onUpdated?.();

            if (!event?.id) {
                resetForm();
            }

            setTimeout(() => {
                onClose?.();
            }, 1200);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                (event?.id
                    ? "Failed to update event"
                    : "Failed to create event")
            );
            setSuccess("");
            setOpenSnackbar(true);
        } finally {
            setLoading(false);
        }
    };

    const selectedCollegeDepartments = departments.filter(
        (department) =>
            (department.college_ids || []).includes(Number(collegeId))
    );

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container>
                <Grid size={12}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Card
                            variant="outlined"
                            sx={{
                                width: {
                                    lg: 600,
                                    md: 550,
                                    sm: 500,
                                    xs: "90vw",
                                },
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
                                "&::-webkit-scrollbar-corner": {
                                    background: "transparent",
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
                                    {event?.id ? "Edit Event" : "Create Event"}
                                </Typography>

                                <Box
                                    sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 2,
                                    }}
                                >
                                    <TextField variant="outlined" fullWidth placeholder="Name of the event"
                                        value={eventName}
                                        onChange={(e) =>
                                            setEventName(e.target.value)
                                        }
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                color: theme.primaryText,
                                                "& .MuiOutlinedInput-notchedOutline": {
                                                    borderColor: theme.cardBorder,
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
                                        }} />

                                    <FormControl
                                        fullWidth
                                        required
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                color: theme.primaryText,
                                                "& fieldset": {
                                                    borderColor: theme.cardBorder,
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: theme.primaryAccent,
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: theme.primaryAccent,
                                                },
                                            },
                                            "& .MuiInputLabel-root": {
                                                color: theme.secondaryText,
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                                color: theme.primaryAccent,
                                            },
                                            "& .MuiSvgIcon-root": {
                                                color: theme.secondaryText,
                                            },
                                        }}
                                    >
                                        <InputLabel sx={{
                                            color: theme.secondaryText,
                                            "&.Mui-focused": {
                                                color: theme.primaryAccent,
                                            },
                                        }}>
                                            Event Type
                                        </InputLabel>

                                        <Select
                                            label="Event Type"
                                            value={eventType}
                                            onChange={(e) => setEventType(e.target.value)}
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
                                                                color: theme.primaryText,
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
                                            <MenuItem value="Workshop">
                                                Workshop
                                            </MenuItem>
                                            <MenuItem value="Course">
                                                Course
                                            </MenuItem>
                                        </Select>
                                    </FormControl>

                                    <TextField
                                        label="Event Description"
                                        value={eventDescription}
                                        onChange={(e) => setEventDescription(e.target.value)}
                                        multiline
                                        minRows={3}
                                        fullWidth
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                color: theme.primaryText,
                                                "& fieldset": {
                                                    borderColor: theme.cardBorder,
                                                    borderWidth: "2px",
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: theme.primaryAccent,
                                                    borderWidth: "2px",
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: theme.primaryAccent,
                                                    borderWidth: "2px",
                                                },
                                            },
                                            "& .MuiInputLabel-root": {
                                                color: theme.secondaryText,
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                                color: theme.primaryAccent,
                                            },
                                            "& .MuiSvgIcon-root": {
                                                color: theme.secondaryText,
                                            },
                                        }}
                                    />

                                    <FormControl
                                        fullWidth
                                        required
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                color: theme.primaryText,
                                                "& fieldset": {
                                                    borderColor: theme.cardBorder,
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: theme.primaryAccent,
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: theme.primaryAccent,
                                                },
                                            },
                                            "& .MuiInputLabel-root": {
                                                color: theme.secondaryText,
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                                color: theme.primaryAccent,
                                            },
                                            "& .MuiSvgIcon-root": {
                                                color: theme.secondaryText,
                                            },
                                        }}
                                    >
                                        <InputLabel sx={{
                                            color: theme.secondaryText,
                                            "&.Mui-focused": {
                                                color: theme.primaryAccent,
                                            },
                                        }}>
                                            College
                                        </InputLabel>

                                        <Select
                                            label="College"
                                            value={collegeId}
                                            onChange={(e) => {
                                                setCollegeId(e.target.value);
                                                setDepartmentId("");
                                            }}
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
                                            {colleges.map((college) => (
                                                <MenuItem
                                                    key={college.id}
                                                    value={college.id}
                                                >
                                                    {college.college_name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl
                                        fullWidth
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                color: theme.primaryText,
                                                "& fieldset": {
                                                    borderColor: theme.cardBorder,
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: theme.primaryAccent,
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: theme.primaryAccent,
                                                },
                                            },
                                            "& .MuiInputLabel-root": {
                                                color: theme.secondaryText,
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                                color: theme.primaryAccent,
                                            },
                                            "& .MuiSvgIcon-root": {
                                                color: theme.secondaryText,
                                            },
                                        }}
                                    >
                                        <InputLabel sx={{
                                            color: theme.secondaryText,
                                            "&.Mui-focused": {
                                                color: theme.primaryAccent,
                                            },
                                        }}>
                                            Department
                                        </InputLabel>

                                        <Select
                                            label="Department"
                                            value={departmentId}
                                            onChange={(e) =>
                                                setDepartmentId(
                                                    e.target.value
                                                )
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
                                            <MenuItem value="All Departments">
                                                All Departments
                                            </MenuItem>

                                            {selectedCollegeDepartments.map(
                                                (department) => (
                                                    <MenuItem
                                                        key={department.id}
                                                        value={department.id}
                                                    >
                                                        {department.department_name}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                    </FormControl>

                                    <FormControl
                                        fullWidth
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                color: theme.primaryText,
                                                "& fieldset": {
                                                    borderColor: theme.cardBorder,
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: theme.primaryAccent,
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: theme.primaryAccent,
                                                },
                                            },
                                            "& .MuiInputLabel-root": {
                                                color: theme.secondaryText,
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                                color: theme.primaryAccent,
                                            },
                                            "& .MuiSvgIcon-root": {
                                                color: theme.secondaryText,
                                            },
                                        }}
                                    >
                                        <InputLabel>Assign Trainer</InputLabel>

                                        <Select
                                            label="Assign Trainer"
                                            value={trainerId}
                                            onChange={(e) => setTrainerId(e.target.value)}
                                            MenuProps={{
                                                PaperProps: {
                                                    sx: {
                                                        bgcolor: theme.cardBg,
                                                        "& .MuiMenuItem-root": {
                                                            color: theme.primaryText,
                                                        },
                                                    },
                                                },
                                            }}
                                        >
                                            <MenuItem value="">
                                                Not Assigned
                                            </MenuItem>

                                            {trainers
                                                .filter((trainer) => trainer.status === "Active")
                                                .map((trainer) => (
                                                    <MenuItem
                                                        key={trainer.id}
                                                        value={trainer.id}
                                                    >
                                                        {trainer.fname} {trainer.lname}
                                                    </MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>

                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                label="Start Date"
                                                type="date"
                                                value={startDate}
                                                onChange={(e) =>
                                                    setStartDate(
                                                        e.target.value
                                                    )
                                                }
                                                slotProps={{
                                                    inputLabel: {
                                                        shrink: true,
                                                    },
                                                }}
                                                required
                                                fullWidth
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: theme.primaryText,
                                                        "& fieldset": {
                                                            borderColor: theme.cardBorder,
                                                            borderWidth: "2px",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                    },
                                                    "& .MuiInputBase-input": {
                                                        color: theme.primaryText,
                                                        colorScheme: localStorage.getItem('themeMode') || sessionStorage.getItem('themeMode'),
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        color: theme.secondaryText,
                                                    },
                                                    "& .MuiInputLabel-root.Mui-focused": {
                                                        color: theme.primaryAccent,
                                                    },
                                                    "& input::-webkit-calendar-picker-indicator": {
                                                        filter: "none",
                                                        cursor: "pointer",
                                                        opacity: 1,
                                                    },
                                                }}
                                            />
                                        </Grid>

                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <TextField
                                                label="End Date"
                                                type="date"
                                                value={endDate}
                                                onChange={(e) =>
                                                    setEndDate(
                                                        e.target.value
                                                    )
                                                }
                                                slotProps={{
                                                    inputLabel: {
                                                        shrink: true,
                                                    },
                                                }}
                                                required
                                                fullWidth
                                                sx={{
                                                    "& .MuiOutlinedInput-root": {
                                                        color: theme.primaryText,
                                                        "& fieldset": {
                                                            borderColor: theme.cardBorder,
                                                            borderWidth: "2px",
                                                        },
                                                        "&:hover fieldset": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                        "&.Mui-focused fieldset": {
                                                            borderColor: theme.primaryAccent,
                                                            borderWidth: "2px",
                                                        },
                                                    },
                                                    "& .MuiInputBase-input": {
                                                        color: theme.primaryText,
                                                        colorScheme: localStorage.getItem('themeMode') || sessionStorage.getItem('themeMode'),
                                                    },
                                                    "& .MuiInputLabel-root": {
                                                        color: theme.secondaryText,
                                                    },
                                                    "& .MuiInputLabel-root.Mui-focused": {
                                                        color: theme.primaryAccent,
                                                    },
                                                    "& input::-webkit-calendar-picker-indicator": {
                                                        filter: "none",
                                                        cursor: "pointer",
                                                        opacity: 1,
                                                    },
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                    <FormControlLabel
                                        sx={{
                                            color: theme.primaryText,
                                        }}
                                        control={
                                            <Switch
                                                checked={registrationRequired}
                                                onChange={(e) =>
                                                    setRegistrationRequired(
                                                        e.target.checked
                                                    )
                                                }
                                                sx={{
                                                    "& .MuiSwitch-switchBase.Mui-checked":
                                                    {
                                                        color: theme.primaryAccent,
                                                    },
                                                    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                                    {
                                                        bgcolor: theme.primaryAccent,
                                                    },
                                                }}
                                            />
                                        }
                                        label="Registration Required"
                                    />

                                    <FormControl
                                        fullWidth
                                        required
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                color: theme.primaryText,
                                                "& fieldset": {
                                                    borderColor: theme.cardBorder,
                                                },
                                                "&:hover fieldset": {
                                                    borderColor: theme.primaryAccent,
                                                },
                                                "&.Mui-focused fieldset": {
                                                    borderColor: theme.primaryAccent,
                                                },
                                            },
                                            "& .MuiInputLabel-root": {
                                                color: theme.secondaryText,
                                            },
                                            "& .MuiInputLabel-root.Mui-focused": {
                                                color: theme.primaryAccent,
                                            },
                                            "& .MuiSvgIcon-root": {
                                                color: theme.secondaryText,
                                            },
                                        }}
                                    >
                                        <InputLabel sx={{
                                            color: theme.secondaryText,
                                            "&.Mui-focused": {
                                                color: theme.primaryAccent,
                                            },
                                        }}>
                                            Event Status
                                        </InputLabel>

                                        <Select
                                            label="Event Status"
                                            value={eventStatus}
                                            onChange={(e) =>
                                                setEventStatus(
                                                    e.target.value
                                                )
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
                                            <MenuItem value="Draft">
                                                Draft
                                            </MenuItem>
                                            <MenuItem value="Published">
                                                Published
                                            </MenuItem>
                                            <MenuItem value="Completed">
                                                Completed
                                            </MenuItem>
                                            <MenuItem value="Cancelled">
                                                Cancelled
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
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
                                            : event?.id
                                                ? "Update Event"
                                                : "Create Event"
                                    }
                                    onClick={handleSaveEvent}
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