// import React from 'react'

import { Alert, Box, Card, CardActions, CardContent, Grid, Link, Snackbar, Typography } from "@mui/material"
import { COLORS } from "./colors"
import logo from '../images/logo.png'
import { useState } from "react"
import { InputField } from "./InputField"
import { ButtonX } from "./ButtonX"

export const AddTeacher = () => {
    const [name, setName] = useState('')
    const [teacherId, setTeacherId] = useState('')
    const [dpt, setDpt] = useState('')

    // snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(false)

    const handleCloseSnackbar = (_, reason) => {
        if (reason === 'clickaway') return
        setOpenSnackbar(false)
    }
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container>
                <Grid size={12}>
                    <Box sx={{ height: '100dvh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
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
                                                            Add teacher
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                        <Grid size={12} sx={{ pb: 2 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                                <Box>
                                                    <Typography sx={{ color: COLORS.mutedText, fontWeight: 'bolder' }}>
                                                        Enter details to add new teacher
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        <Grid size={12}>
                                            <Box sx={{ width: '100%' }}>
                                                <InputField placeholder={"Teacher's Name"} theme={COLORS}
                                                    value={name} onChange={(e) => setName(e.target.value)} />
                                            </Box>
                                        </Grid>
                                        <Grid size={12}>
                                            <Box sx={{ width: '100%' }}>
                                                <InputField placeholder={"Teacher's Enroll Id"} theme={COLORS}
                                                    value={teacherId} onChange={(e) => setTeacherId(e.target.value)} />
                                            </Box>
                                        </Grid>
                                        <Grid size={12}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <InputField placeholder={"Department"} theme={COLORS}
                                                    value={dpt} onChange={(e) => setDpt(e.target.value)} />
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent><br />
                            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ButtonX name={loading ? "ADDING..." : "ADD NEW TEACHER"} theme={COLORS} />
                            </CardActions>
                            <CardContent sx={{ pb: 0 }}>
                                <Box sx={{ textAlign: 'center', color: COLORS.secondaryText }}>
                                    For Admin Login <Link href="/admin/login" sx={{
                                        color: COLORS.primaryText, textDecoration: 'none',
                                        '&:hover': {
                                            cursor: 'pointer', color: COLORS.mutedText
                                        }
                                    }}>Click Here</Link>
                                </Box>
                            </CardContent>
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
