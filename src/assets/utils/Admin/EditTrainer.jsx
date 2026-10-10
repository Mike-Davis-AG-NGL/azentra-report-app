// import React from 'react'

import { useEffect, useState } from "react"
import { UseTheme } from "../../Controllers/UseTheme"
import { Alert, Box, Card, CardActions, CardContent, Grid, Snackbar, Typography } from "@mui/material"
import { InputField } from "../InputField"
import { ButtonX } from "../ButtonX"
import axios from "axios"
import { SelectUI } from "../SelectUI"

export const EditTrainer = ({ trainer, onClose, onUpdated }) => {
    const theme = UseTheme()
    const [fname, setFname] = useState('')
    const [lname, setLname] = useState('')
    const [email, setEmail] = useState('')
    const [mobile, setMobile] = useState('')
    const [specialization, setSpecialization] = useState('')
    const [status, setStatus] = useState('')

    const [loading, setLoading] = useState(false)

    // snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleCloseSnackbar = (_, reason) => {
        if (reason === 'clickaway') return
        setOpenSnackbar(false)
    }

    const handleUpdateTrainer = async () => {
        if (!trainer?.id) return
        try {
            setLoading(true)
            setError("")
            setSuccess("")
            const token = localStorage.getItem("token") || sessionStorage.getItem("token")
            const response = await axios.patch(
                `http://localhost:5000/api/auth/trainer/edit/${trainer.id}`,{
                    fname, lname, email, mobile, specialization, status
                }, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
            setSuccess(response.data.message)
            setOpenSnackbar(true)
            await onUpdated?.()
            setTimeout(() => {
                onClose?.()
            }, 1200);
        } catch (error) {
            setError(
                error.response?.data?.message || "Failed to update trainer profile"
            )
            setSuccess("")
            setOpenSnackbar(true)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (trainer) {
            setFname(trainer.fname || "")
            setLname(trainer.lname || "")
            setEmail(trainer.email || "")
            setMobile(trainer.mobile || "")
            setSpecialization(trainer.specialization || "")
            setStatus(trainer.status || "")
        }
    },[trainer])
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container>
                <Grid size={12}>
                    <Box sx={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                                                        Edit {trainer?.fname} {trainer?.lname}'s Profile
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
                                <ButtonX name={loading ? "Updating..." : "Update Trainer"} onClick={handleUpdateTrainer} />
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
        </Box>
    )
}
