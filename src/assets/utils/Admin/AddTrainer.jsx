// import React from 'react'

import { Alert, Backdrop, Box, Card, CardActions, CardContent, Grid, Snackbar, Typography } from "@mui/material"
import { UseTheme } from "../../Controllers/UseTheme"
import { ButtonX } from "../ButtonX"
import { useState } from "react"
import { InputField } from "../InputField"
import { SelectUI } from "../SelectUI"
import axios from "axios"

export const AddTrainer = () => {
    const theme = UseTheme()
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [specialization, setSpecialization] = useState('')
    const [status, setStatus] = useState('Active')
    const [trainerCredentials, setTrainerCredentials] = useState({
        trainer_id: '',
        email: '',
        temporary_password: ''
    })

    const [loading, setLoading] = useState(false)

    // snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleCloseSnackbar = (_, reason) => {
        if (reason === 'clickaway') return
        setOpenSnackbar(false)
    }

    // Backdrop
    const [openBackdrop, setOpenBackdrop] = useState(false);
    const handleCloseBackdrop = () => setOpenBackdrop(false)

    const clearForm = () => {
        setFname('')
        setLname('')
        setEmail('')
        setMobile('')
        setSpecialization('')
        setStatus('Active')
    }

    const handleAddTrainer = async () => {
        setError('')
        setSuccess('')
        if (!fname.trim() || !lname.trim() || !email.trim() || !mobile.trim() || !specialization.trim()) {
            setError("All trainer fields required")
            setOpenSnackbar(true)
            return
        }
        setLoading(true)
        try {
            const response = await axios.post("http://localhost:5000/api/auth/signup", {
                fname: fname.trim(), lname: lname.trim(), email: email.trim().toLowerCase(),
                mobile: mobile.trim(), specialization: specialization.trim(), status: status
            })
            setError('')
            setSuccess('Trainer created successfully')
            setTrainerCredentials({
                trainer_id: response.data.credentials.trainer_id,
                email: response.data.credentials.email,
                temporary_password: response.data.credentials.temporary_password
            })
            setOpenBackdrop(true)
            clearForm()
        } catch (error) {
            setSuccess('')
            setError(error.response ? (error.response.data?.message || "Failed to create trainer") : "Unable to connect to server")
            setOpenSnackbar(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container>
                <Grid size={12}>
                    <Box sx={{ height: '84dvh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Card variant="outlined" sx={{
                            width: { lg: 400, md: 400, sm: 400, xs: 300 },
                            backgroundColor: theme.cardBg, border: `solid 2px ${theme.cardBorder}`, borderRadius: 5,
                            boxShadow: `0px 0px 8px 10px ${theme.shadow}`
                        }}>
                            <CardContent sx={{ pb: 0 }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Grid container>
                                        <Grid size={12}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                                <Box>
                                                    <Typography sx={{ color: theme.mutedText, fontWeight: 'bolder' }}>
                                                        Create account for Trainers
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid size={12}>
                                            <Box sx={{ width: '100%', pt: 2, flexGrow: 1 }}>
                                                <Grid container spacing={2}>
                                                    <Grid size={6}>
                                                        <Box sx={{ width: '100%', pt: 2 }}>
                                                            <InputField placeholder={"First Name"} theme={theme}
                                                                onChange={(e) => setFname(e.target.value)} value={fname} />
                                                        </Box>
                                                    </Grid>
                                                    <Grid size={6}>
                                                        <Box sx={{ width: '100%', pt: 2 }}>
                                                            <InputField placeholder={"Last Name"} theme={theme}
                                                                onChange={(e) => setLname(e.target.value)} value={lname} />
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                            <Box sx={{ width: '100%', pt: 2 }}>
                                                <InputField placeholder={"Enter Trainer Email"} theme={theme} mode="email"
                                                    onChange={(e) => setEmail(e.target.value)} value={email} />
                                            </Box>
                                            <Box sx={{ width: '100%', pt: 2 }}>
                                                <InputField placeholder={"Enter Trainer Mobile Number"} theme={theme} mode="mobile"
                                                    onChange={(e) => setMobile(e.target.value)} value={mobile} />
                                            </Box>
                                            <Box sx={{ width: '100%', pt: 2 }}>
                                                <InputField placeholder={"Enter Trainer Specialization"} theme={theme}
                                                    onChange={(e) => setSpecialization(e.target.value)} value={specialization} />
                                            </Box>
                                            <Box sx={{ width: '100%', pt: 2 }}>
                                                <Typography sx={{ color: theme.primaryText, fontWeight: 'bolder' }}>
                                                    Set account status
                                                </Typography>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', pt: 2 }}>
                                                    <SelectUI value={status} setValue={setStatus} />
                                                </Box>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent><br />
                            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ButtonX name={loading ? "Creating..." : "Add Trainer"} onClick={handleAddTrainer} />
                            </CardActions><br />
                        </Card>
                    </Box>
                </Grid>
            </Grid>
            <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} variant='filled' severity={error ? 'error' : 'success'}
                    sx={{
                        backgroundColor: error ? theme.error : theme.success
                    }}>
                    {error || success}
                </Alert>
            </Snackbar>
            <Backdrop
                sx={(themes) => ({ color: theme.primaryText, zIndex: themes.zIndex.drawer + 1 })}
                open={openBackdrop}
            >
                <Card variant="outlined" sx={{
                    width: { lg: 300, md: 300, sm: 300, xs: 250 },
                    backgroundColor: theme.cardBg, border: `solid 2px ${theme.cardBorder}`, borderRadius: 5,
                    boxShadow: `0px 0px 8px 10px ${theme.shadow}`
                }}>
                    <CardContent>
                        <Typography gutterBottom sx={{ color: theme.success, fontSize: 20 }}>
                            Trainer account created Successfully
                        </Typography>
                        <Typography gutterBottom sx={{ color: theme.secondaryText, fontSize: 14 }}>
                            Trainer email: <br /><span style={{ color: theme.primaryText }}>{trainerCredentials.email}</span>
                        </Typography>
                        <Typography variant="h5" component="div">
                            Trainer ID: <br /><span style={{ color: theme.primaryText }}>{trainerCredentials.trainer_id}</span>
                        </Typography>
                        <Typography sx={{ color: theme.secondaryText, mb: 1.5 }}>
                            Temporary password: <br />
                            <span style={{ color: theme.primaryText }}>{trainerCredentials.temporary_password}</span>
                        </Typography>
                        <Typography
                            sx={{ color: theme.error, fontSize: 13, mt: 3 }}>
                            Please save these credentials. The trainer must change
                            the temporary password during their first login.
                        </Typography>
                    </CardContent>
                    <CardActions>
                        <ButtonX name="Close" onClick={handleCloseBackdrop} />
                    </CardActions>
                </Card>
            </Backdrop>
        </Box>
    )
}
