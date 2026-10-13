import { useEffect, useState } from "react"
import { UseTheme } from "../../Controllers/UseTheme"
import { Alert, Box, Card, CardActions, CardContent, Grid, Snackbar, Typography } from "@mui/material"
import { InputField } from "../InputField"
import { ButtonX } from "../ButtonX"
import { SelectUI } from "../SelectUI"
import axios from "axios"

export const AddEditCollege = ({ college, onClose, onUpdated }) => {
    const theme = UseTheme()

    const [collegeName, setCollegeName] = useState("")
    const [collegeCode, setCollegeCode] = useState("")
    const [address, setAddress] = useState("")
    const [city, setCity] = useState("")
    const [state, setState] = useState("")
    const [contactPerson, setContactPerson] = useState("")
    const [contactEmail, setContactEmail] = useState("")
    const [contactMobile, setContactMobile] = useState("")
    const [logo, setLogo] = useState("")
    const [status, setStatus] = useState("Active")

    const [loading, setLoading] = useState(false)

    // Snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const handleCloseSnackbar = (_, reason) => {
        if (reason === "clickaway") return
        setOpenSnackbar(false)
    }

    useEffect(() => {
        setCollegeName(college?.college_name || "")
        setCollegeCode(college?.college_code || "")
        setAddress(college?.address || "")
        setCity(college?.city || "")
        setState(college?.state || "")
        setContactPerson(college?.contact_person || "")
        setContactEmail(college?.contact_email || "")
        setContactMobile(college?.contact_mobile || "")
        setLogo(college?.logo || "")
        setStatus(college?.status || "Active")
    }, [college])

    const handleSaveCollege = async () => {
        if (!collegeName.trim()) {
            setError("College name is required")
            setSuccess("")
            setOpenSnackbar(true)
            return
        }

        const collegeData = {
            college_name: collegeName.trim(),
            college_code: collegeCode.trim() || null,
            address: address.trim() || null,
            city: city.trim() || null,
            state: state.trim() || null,
            contact_person: contactPerson.trim() || null,
            contact_email: contactEmail.trim() || null,
            contact_mobile: contactMobile.trim() || null,
            logo: logo.trim() || null,
            status
        }

        try {
            setLoading(true)
            setError("")
            setSuccess("")

            const token =
                localStorage.getItem("token") ||
                sessionStorage.getItem("token")

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }

            const response = college?.id
                ? await axios.patch(
                    `http://localhost:5000/api/college/${college.id}`,
                    collegeData,
                    config
                )
                : await axios.post(
                    "http://localhost:5000/api/college/create",
                    collegeData,
                    config
                )

            setSuccess(
                response.data.message ||
                (college?.id
                    ? "College updated successfully"
                    : "College added successfully")
            )
            setOpenSnackbar(true)

            await onUpdated?.()

            setTimeout(() => {
                onClose?.()
            }, 1200)
        } catch (error) {
            setError(
                error.response?.data?.message ||
                (college?.id
                    ? "Failed to update college"
                    : "Failed to add college")
            )
            setSuccess("")
            setOpenSnackbar(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container>
                <Grid size={12}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <Card
                            variant="outlined"
                            sx={{
                                width: { lg: 600, md: 550, sm: 500, xs: 300 },
                                maxHeight: "85vh",
                                overflowY: "auto",
                                backgroundColor: theme.cardBg,
                                border: `solid 2px ${theme.cardBorder}`,
                                borderRadius: 5,
                                boxShadow: `0px 0px 8px 10px ${theme.shadow}`
                            }}
                        >
                            <CardContent sx={{ pb: 0 }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Grid container spacing={2}>
                                        <Grid size={12}>
                                            <Box sx={{ display: "flex", justifyContent: "center", pb: 2 }}>
                                                <Typography sx={{ color: theme.mutedText, fontWeight: "bolder" }}>
                                                    {college?.id ? `Edit ${college.college_name}` : "Add College"}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                        <Grid size={12}>
                                            <InputField
                                                placeholder="Enter College Name"
                                                theme={theme}
                                                value={collegeName}
                                                onChange={(e) =>
                                                    setCollegeName(e.target.value)
                                                }
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <InputField
                                                placeholder="Enter College Code"
                                                theme={theme}
                                                value={collegeCode}
                                                onChange={(e) =>
                                                    setCollegeCode(e.target.value)
                                                }
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <InputField
                                                placeholder="Enter Address"
                                                theme={theme}
                                                value={address}
                                                onChange={(e) =>
                                                    setAddress(e.target.value)
                                                }
                                            />
                                        </Grid>
                                        <Grid size={6}>
                                            <InputField
                                                placeholder="Enter City"
                                                theme={theme}
                                                value={city}
                                                onChange={(e) =>
                                                    setCity(e.target.value)
                                                }
                                            />
                                        </Grid>
                                        <Grid size={6}>
                                            <InputField
                                                placeholder="Enter State"
                                                theme={theme}
                                                value={state}
                                                onChange={(e) =>
                                                    setState(e.target.value)
                                                }
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <InputField
                                                placeholder="Enter Contact Person"
                                                theme={theme}
                                                value={contactPerson}
                                                onChange={(e) =>
                                                    setContactPerson(e.target.value)
                                                }
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <InputField
                                                placeholder="Enter Contact Email"
                                                theme={theme}
                                                mode="email"
                                                value={contactEmail}
                                                onChange={(e) =>
                                                    setContactEmail(e.target.value)
                                                }
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <InputField
                                                placeholder="Enter Contact Mobile Number"
                                                theme={theme}
                                                mode="mobile"
                                                value={contactMobile}
                                                onChange={(e) =>
                                                    setContactMobile(e.target.value)
                                                }
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <InputField
                                                placeholder="Enter Logo URL or Path"
                                                theme={theme}
                                                value={logo}
                                                onChange={(e) =>
                                                    setLogo(e.target.value)
                                                }
                                            />
                                        </Grid>
                                        <Grid size={12}>
                                            <Typography
                                                sx={{
                                                    color: theme.primaryText,
                                                    fontWeight: "bolder"
                                                }}
                                            >
                                                Set College Status
                                            </Typography>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    pt: 2
                                                }}
                                            >
                                                <SelectUI
                                                    value={status}
                                                    setValue={setStatus}
                                                />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                            <CardActions
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    gap: 2,
                                    pt: 3
                                }}
                            >
                                <ButtonX
                                    name={loading ? "Saving..." : college?.id ? "Update College" : "Add College"}
                                    onClick={handleSaveCollege}
                                />
                                <ButtonX
                                    name="Cancel"
                                    onClick={onClose}
                                />
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
                        backgroundColor: error
                            ? theme.error
                            : theme.success
                    }}
                >
                    {error || success}
                </Alert>
            </Snackbar>
        </Box>
    )
}