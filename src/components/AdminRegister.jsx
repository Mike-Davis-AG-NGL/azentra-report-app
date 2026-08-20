import { Box, Card, CardContent, CircularProgress, Grid, Typography } from '@mui/material'
import { COLORS } from '../assets/utils/colors'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import axios from 'axios'

export const AdminRegister = () => {
    const navigate = useNavigate()

    const [adminId, setAdminId] = useState('')
    const [secret, setSecret] = useState('')
    const [qr, setQr] = useState('')
    const [loading, setLoading] = useState(true)

    const [timeLeft, setTimeLeft] = useState(600)

    useEffect(() => { fetchSetup() }, [])

    useEffect(() => {
        if (timeLeft <= 0) {
            navigate("/admin/login")
            return
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000);

        return () => clearInterval(timer)
    }, [timeLeft, navigate])

    const fetchSetup = async () => {
        try {
            const response = await axios.post("http://localhost:5000/api/admin/auth/setup")
            setAdminId(response.data.admin_id)
            setSecret(response.data.secret)
            setQr(response.data.qr)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, "0")
    const seconds = String(timeLeft % 60).padStart(2, "0")

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container spacing={2}>
                <Grid size={12}>
                    <Box sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Card variant="outlined" sx={{
                            width: { lg: 400, md: 400, sm: 400, xs: 300 },
                            backgroundColor: COLORS.cardBg, border: `solid 2px ${COLORS.cardBorder}`, borderRadius: 5,
                            boxShadow: `0px 0px 8px 10px ${COLORS.shadow}`
                        }}>
                            <CardContent sx={{ pb: 0 }}>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Grid container spacing={2}>
                                        <Grid size={12}>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Grid container>
                                                    <Grid size={12}>
                                                        <Typography sx={{
                                                            fontWeight: 'bolder', fontStyle: 'italic', color: COLORS.primaryText,
                                                            fontSize: { lg: 40, md: 40, sm: 35, xs: 25 }, textAlign: 'center'
                                                        }}>
                                                            Admin Registration
                                                        </Typography>
                                                    </Grid>
                                                    <Grid size={12}>
                                                        <Typography sx={{
                                                            color: COLORS.secondaryText, textAlign: 'center',
                                                            fontSize: { lg: 20, md: 20, sm: 18, xs: 15 }
                                                        }}>
                                                            Scan QR to setup authentication
                                                        </Typography>
                                                    </Grid>
                                                </Grid><br />
                                                <Grid size={12}>
                                                    <Box sx={{ flexGrow: 1 }}>
                                                        {loading ? (
                                                            <Grid container>
                                                                <Grid size={12}>
                                                                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100dvh' }}>
                                                                        <CircularProgress size={20} color="inherit" />
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                        ) : (
                                                            <Grid container>
                                                                <Grid size={12}>
                                                                    <Box sx={{display: 'flex', gap: 2, justifyContent: 'center'}}>
                                                                        <Typography sx={{
                                                                            color: COLORS.primaryText
                                                                        }}>
                                                                            Admin ID
                                                                        </Typography>
                                                                        <Typography>
                                                                            &#8211;
                                                                        </Typography>
                                                                        <Typography sx={{
                                                                            color: COLORS.secondaryText
                                                                        }}>
                                                                            {adminId}
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid size={12}>
                                                                    <Typography
                                                                        sx={{
                                                                            fontWeight: "bold",
                                                                            color: COLORS.mutedText,
                                                                            textAlign: "center"
                                                                        }}
                                                                    >
                                                                        Expires in {minutes}:{seconds}
                                                                    </Typography>
                                                                </Grid>
                                                                <Grid size={12}>
                                                                    <Box sx={{display: 'flex', justifyContent: 'center'}}>
                                                                        <Box component="img" src={`data:image/png;base64,${qr}`} alt="Authenticator QR" 
                                                                        sx={{height: '250px', width: '250px'}}/>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid size={12}>
                                                                    <Typography sx={{
                                                                        fontWeight: 'bold',
                                                                        color: COLORS.primaryText,
                                                                        textAlign: 'center'
                                                                    }}>
                                                                        Manual Setup Key
                                                                    </Typography>
                                                                    <Typography sx={{
                                                                        wordBreak: "break-all",
                                                                        color: COLORS.secondaryText,
                                                                        textAlign: 'center'
                                                                    }}>
                                                                        {secret}
                                                                    </Typography>
                                                                </Grid>
                                                            </Grid>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                        </Card>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}
