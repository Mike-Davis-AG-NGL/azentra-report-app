import { useEffect, useState } from "react";
import { UseTheme } from "../../Controllers/UseTheme";
import { Alert, Box, Card, CardActions, CardContent, Checkbox, FormControl, Grid, InputLabel, ListItemText, MenuItem, Select, Snackbar, Typography, } from "@mui/material";
import { InputField } from "../InputField";
import { ButtonX } from "../ButtonX";
import { SelectUI } from "../SelectUI";
import axios from "axios";

export const AddEditDepartment = ({ department, onClose, onUpdated }) => {
    const theme = UseTheme();

    const [departmentName, setDepartmentName] = useState("");
    const [departmentCode, setDepartmentCode] = useState("");
    const [collegeIds, setCollegeIds] = useState([]);
    const [colleges, setColleges] = useState([]);
    const [status, setStatus] = useState("Active");
    const [loading, setLoading] = useState(false);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleCloseSnackbar = (_, reason) => {
        if (reason === "clickaway") return;
        setOpenSnackbar(false);
    };

    useEffect(() => {
        const loadFormData = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/college/");
                setColleges(response.data.colleges || []);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load colleges");
                setOpenSnackbar(true);
            }
        };

        loadFormData();
    }, []);

    useEffect(() => {
        setDepartmentName(department?.department_name || "");
        setDepartmentCode(department?.department_code || "");
        setCollegeIds(Array.isArray(department?.college_ids) ? department.college_ids.map(String) : []);
        setStatus(department?.status || "Active");
    }, [department]);

    const handleSaveDepartment = async () => {
        if (!departmentName.trim()) {
            setError("Department name is required");
            setSuccess("");
            setOpenSnackbar(true);
            return;
        }

        if (collegeIds.length === 0) {
            setError("Please select at least one college");
            setSuccess("");
            setOpenSnackbar(true);
            return;
        }

        const departmentData = {
            department_name: departmentName.trim(),
            department_code: departmentCode.trim() || null,
            college_ids: collegeIds.map(Number),
            status,
        };

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = department?.id
                ? await axios.patch(`http://localhost:5000/api/department/${department.id}`, departmentData, config)
                : await axios.post("http://localhost:5000/api/department/create", departmentData, config);

            setSuccess(response.data.message || (department?.id ? "Department updated successfully" : "Department added successfully"));
            setOpenSnackbar(true);

            await onUpdated?.();
            setTimeout(() => { onClose?.(); }, 1200);
        } catch (err) {
            setError(err.response?.data?.message || (department?.id ? "Failed to update department" : "Failed to add department"));
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
                                width: { lg: 600, md: 550, sm: 500, xs: 300 },
                                maxHeight: "85vh",
                                overflowY: "auto",
                                backgroundColor: theme.cardBg,
                                border: `solid 2px ${theme.cardBorder}`,
                                borderRadius: 5,
                                boxShadow: `0px 0px 8px 10px ${theme.shadow}`,
                            }}
                        >
                            <CardContent sx={{ pb: 0 }}>
                                <Grid container spacing={2}>
                                    <Grid size={12}>
                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                pb: 2,
                                            }}
                                        >
                                            <Typography
                                                sx={{
                                                    color: theme.mutedText,
                                                    fontWeight: "bolder",
                                                }}
                                            >
                                                {department?.id
                                                    ? `Edit ${department.department_name}`
                                                    : "Add Department"}
                                            </Typography>
                                        </Box>
                                    </Grid>

                                    <Grid size={12}>
                                        <InputField
                                            placeholder="Enter Department Name"
                                            theme={theme}
                                            value={departmentName}
                                            onChange={(e) =>
                                                setDepartmentName(e.target.value)
                                            }
                                        />
                                    </Grid>

                                    <Grid size={12}>
                                        <InputField
                                            placeholder="Enter Department Code"
                                            theme={theme}
                                            value={departmentCode}
                                            onChange={(e) =>
                                                setDepartmentCode(e.target.value)
                                            }
                                        />
                                    </Grid>
                                    <Grid size={12}>
                                        <FormControl fullWidth>
                                            <InputLabel
                                                id="college-select-label"
                                                sx={{ color: theme.primaryText }}
                                            >
                                                Select Colleges
                                            </InputLabel>
                                            <Select
                                                labelId="college-select-label"
                                                multiple
                                                value={collegeIds}
                                                label="Select Colleges"
                                                onChange={(e) => setCollegeIds(e.target.value)}
                                                renderValue={(selected) =>
                                                    colleges
                                                        .filter((college) => selected.includes(String(college.id)))
                                                        .map((college) => college.college_name)
                                                        .join(", ")
                                                }
                                                sx={{
                                                    color: theme.primaryText,
                                                    "& .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: theme.cardBorder,
                                                    },
                                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                                        borderColor: theme.primaryText,
                                                    },
                                                    "& .MuiSvgIcon-root": {
                                                        color: theme.primaryText,
                                                    },
                                                }}
                                                MenuProps={{
                                                    PaperProps: {
                                                        sx: {
                                                            bgcolor: theme.cardBg,
                                                            color: theme.primaryText,
                                                        },
                                                    },
                                                }}
                                            >
                                                {colleges.map((college) => (
                                                    <MenuItem
                                                        key={college.id}
                                                        value={String(college.id)}
                                                    >
                                                        <Checkbox
                                                            checked={collegeIds.includes(String(college.id))}
                                                            sx={{ color: theme.primaryText }}
                                                        />
                                                        <ListItemText primary={college.college_name} />
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>

                                    <Grid size={12}>
                                        <Typography
                                            sx={{
                                                color: theme.primaryText,
                                                fontWeight: "bolder",
                                            }}
                                        >
                                            Set Department Status
                                        </Typography>

                                        <Box
                                            sx={{
                                                display: "flex",
                                                justifyContent: "center",
                                                pt: 2,
                                            }}
                                        >
                                            <SelectUI
                                                value={status}
                                                setValue={setStatus}
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>

                            <CardActions
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: 2,
                                    pt: 3,
                                }}
                            >
                                <ButtonX
                                    name={
                                        loading
                                            ? "Saving..."
                                            : department?.id
                                                ? "Update Department"
                                                : "Add Department"
                                    }
                                    onClick={handleSaveDepartment}
                                />

                                <ButtonX name="Cancel" onClick={onClose} />
                            </CardActions>

                            <br />
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
                        backgroundColor: error ? theme.error : theme.success,
                    }}
                >
                    {error || success}
                </Alert>
            </Snackbar>
        </Box>
    );
};