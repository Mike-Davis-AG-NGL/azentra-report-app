// import React from 'react'

import { Alert, Box, Card, CardActions, CardContent, Grid, Link, Snackbar, Typography } from "@mui/material"
import admin from '../assets/images/Admin.jpg'
import adminXS from '../assets/images/AdminMobile.jpg'
import logo from '../assets/images/logo.png'
import { COLORS } from "../assets/utils/colors"
import { useState } from "react"
import { ButtonX } from "../assets/utils/ButtonX"
import { InputField } from "../assets/utils/InputField"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export const AdminLogin = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)

    const [adminEmail, setAdminEmail] = useState('')
    const [otp, setOtp] = useState('')

    // snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleCloseSnackbar = (_, reason) => {
        if (reason === 'clickaway') return
        setOpenSnackbar(false)
    }

    const handleLogin = async () => {
        setError('')
        setSuccess('')

        if (!adminEmail || !otp) {
            setError("Admin Email and OTP are required")
            setOpenSnackbar(true)
            return
        }
        setLoading(true)

        try {
            const response = await axios.post("http://localhost:5000/api/admin/login",{
                admin_email: adminEmail,
                otp
            })

            if (response.data.success) {
                const token = response.data.token
                const user = response.data.user

                localStorage.setItem("token", token)
                localStorage.setItem("user", user.role)

                setSuccess("Login Successful")
                setOpenSnackbar(true)
                navigate("/admin/")
            }
        } catch (error) {
            setSuccess('')
            error.response ? setError(error.response.data.message || "login failed") : setError("Unable to connect to server")
            setOpenSnackbar(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
            <Box sx={{
                display: { lg: 'none', md: 'none', sm: 'block', xs: 'none' }, position: 'absolute',
                backgroundImage: `url(${admin})`, backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'blur(5px)', zIndex: 0, inset: 0, animation: 'fadeZoom 300ms ease-in-out'
            }}></Box>
            <Box sx={{
                display: { lg: 'none', md: 'none', sm: 'none', xs: 'block' }, position: 'absolute',
                backgroundImage: `url(${adminXS})`, backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'blur(5px)', zIndex: 0, inset: 0, animation: 'fadeZoom 300ms ease-in-out'
            }}></Box>
            <Grid container spacing={2} sx={{ zIndex: 1, position: 'relative' }}>
                <Grid size={6} sx={{
                    display: { lg: 'flex', md: 'flex', sm: 'none', xs: 'none' },
                    alignItems: 'center', height: '100vh', overflow: 'hidden', m: 0, p: 0
                }}>
                    <Box sx={{ height: '100%', width: '100%', overflow: 'hidden' }}>
                        <Box component="img" src={admin} alt="Teacher Image" sx={{
                            objectFit: 'cover', width: '100%', height: '100%',
                            animation: 'fadeZoom 300ms ease-in-out'
                        }}></Box>
                    </Box>
                </Grid>
                <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Card variant="outlined" sx={{
                            width: { lg: 400, md: 400, sm: 400, xs: 300 },
                            backgroundColor: COLORS.cardBg, border: `solid 2px ${COLORS.cardBorder}`, borderRadius: 5,
                            boxShadow: `0px 0px 8px 10px ${COLORS.shadow}`
                        }}>
                            <CardContent sx={{ pb: 0 }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Grid container spacing={2}>
                                        <Grid size={4} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                            <Box component="img" src={logo} alt="app logo"
                                                sx={{ height: { lg: 100, md: 100, sm: 80, xs: 60 }, width: { lg: 100, md: 100, sm: 80, xs: 60 } }}></Box>
                                        </Grid>
                                        <Grid size={8}>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Grid container>
                                                    <Grid size={12}>
                                                        <Typography sx={{
                                                            fontWeight: 'bolder', fontStyle: 'italic', color: COLORS.primaryText,
                                                            fontSize: { lg: 40, md: 40, sm: 35, xs: 25 }, textAlign: 'center'
                                                        }}>
                                                            Azentra
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={12}>
                                                        <Typography sx={{
                                                            color: COLORS.secondaryText, textAlign: 'center',
                                                            fontSize: { lg: 20, md: 20, sm: 18, xs: 15 }
                                                        }}>
                                                            Report App
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Grid size={12}>
                                        <Box sx={{ width: '100%', pt: 2 }}>
                                            <InputField placeholder={"Enter Admin Email"} theme={COLORS} 
                                            onChange={(e) => setAdminEmail(e.target.value)} value={adminEmail}/>
                                        </Box>
                                        <Box sx={{ width: '100%', pt: 2 }}>
                                            <InputField placeholder={"Enter OTP from authenticator"} theme={COLORS} 
                                            onChange={(e) => setOtp(e.target.value)} value={otp}/>
                                        </Box>
                                    </Grid>
                                </Box>
                            </CardContent><br />
                            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ButtonX name={loading ? "LOGGING..." : "LOGIN"} onClick={handleLogin} disabled={loading}/>
                            </CardActions><br />
                            {/* <CardContent sx={{ pb: 0 }}>
                                <Box sx={{ textAlign: 'center', color: COLORS.secondaryText }}>
                                    For Teacher/Student Login <Link href="/login" sx={{
                                        color: COLORS.primaryText, textDecoration: 'none',
                                        '&:hover': {
                                            cursor: 'pointer', color: COLORS.mutedText
                                        }
                                    }}>Click Here</Link>
                                </Box>
                            </CardContent> */}
                        </Card>
                    </Box>
                </Grid>
            </Grid>
            <Snackbar open={openSnackbar} autoHideDuration={5000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} variant='filled' severity={error ? 'error' : 'success'}
                    sx={{
                        backgroundColor: error ? COLORS.error : COLORS.success
                    }}>
                    {error || success}
                </Alert>
            </Snackbar>
        </Box>
    )
}
