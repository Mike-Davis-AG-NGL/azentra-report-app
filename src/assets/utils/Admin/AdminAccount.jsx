// import React from 'react'

import { Delete, Download } from "@mui/icons-material"
import { Alert, Box, Grid, Snackbar, Typography } from "@mui/material"
import { ClickableCard } from "../ClickableCard"
import { UseTheme } from "../../Controllers/UseTheme"
import { useRef, useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { QRCodeSVG } from "qrcode.react"
import html2canvas from "html2canvas"

export const AdminAccount = () => {
    const theme = UseTheme()
    const navigate = useNavigate()
    const cardRef = useRef()

    const [adminEmail, setAdminEmail] = useState('')
    const [secret, setSecret] = useState('')
    const [qrUri, setQrUri] = useState('')

    // snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleCloseSnackbar = (_, reason) => {
        if (reason === 'clickaway') return
        setOpenSnackbar(false)
    }

    const downloadAccount = async () => {
        const token = localStorage.getItem('token')
        console.log("TOKEN:", token)
        try {
            const response = await axios.get("http://localhost:5000/api/admin/account/details", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("RESPONSE:", response.data)
            if (!response.data.success) {
                throw new Error(response.data.message || "Unable to get account details");
            }

            const account = response.data.account

            setAdminEmail(account.email)
            setSecret(account.totp)
            setQrUri(account.qr_uri)

            setTimeout(async () => {
                if (!cardRef.current) return

                try {
                    const canvas = await html2canvas(cardRef.current, {
                        scale: 2,
                        backgroundColor: theme.cardBg,
                        useCORS: true
                    })

                    const image = canvas.toDataURL("image/png")
                    const link = document.createElement("a")
                    link.href = image
                    link.download = "admin-account-details.png"

                    document.body.appendChild(link)
                    link.click()
                    document.body.removeChild(link)

                    setError('')
                    setSuccess('Account details downloaded successfully')
                    setOpenSnackbar(true)
                } catch (error) {
                    setSuccess('')
                    setError(error.response?.data?.message || "Error creating account details")
                    setOpenSnackbar(true)
                }
            }, 300);
        } catch (error) {
            setSuccess('')
            setError(error.response?.data?.message || "Error downloading account details")
            setOpenSnackbar(true)
        }
    }

    const deleteAccount = async () => {
        const token = localStorage.getItem("token")

        try {
            const response = await axios.delete("http://localhost:5000/api/admin/delete/account", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (response.data.success) {
                localStorage.removeItem('token')
                navigate('/admin/')
            }
        } catch (error) {
            setSuccess('')
            setError(error.response?.data?.message || "Error deleting account")
            setOpenSnackbar(true)
        }
    }

    return (
        <Box sx={{ flexGrow: 1, height: '100dvh', bgcolor: theme.primaryBg }}>
            <Grid container>
                <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 10 }}>
                        <ClickableCard onClick={downloadAccount} content={
                            <Box>
                                <Box>
                                    <Download sx={{ color: theme.primaryText, fontSize: 280 }} />
                                </Box>
                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <Typography sx={{ fontWeight: 'bold', color: theme.secondaryText, fontSize: 20 }}>
                                        Download Account Details
                                    </Typography>
                                </Box>
                            </Box>
                        } />
                    </Box>
                </Grid>
                <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-start', p: 10 }}>
                        <ClickableCard onClick={deleteAccount} content={
                            <Box>
                                <Box>
                                    <Delete sx={{ color: theme.error, fontSize: 280 }} />
                                </Box>
                                <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
                                    <Typography sx={{ fontWeight: 'bold', color: theme.secondaryText, fontSize: 20 }}>
                                        Download Account Details
                                    </Typography>
                                </Box>
                            </Box>
                        } />
                    </Box>
                </Grid>
            </Grid>
            <Box sx={{ position: 'absolute', left: '-10000px', top: 0 }}>
                <Box ref={cardRef}
                    sx={{
                        width: '600px',
                        minHeight: '650px',
                        padding: '40px',
                        bgcolor: theme.primaryBg,
                        borderRadius: '20px',
                        boxSizing: 'border-box',
                        border: `2px solid ${theme.primaryText}`
                    }}>
                    <Grid container>
                        <Grid size={12}>
                            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                <Typography sx={{
                                    color: theme.primaryText
                                }}>
                                    Admin Email
                                </Typography>
                                <Typography>
                                    &#8211;
                                </Typography>
                                <Typography sx={{
                                    color: theme.secondaryText
                                }}>
                                    {adminEmail}
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid size={12}>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                {qrUri && (
                                    <QRCodeSVG
                                        value={qrUri}
                                        size={250}
                                        bgColor="#ffffff"
                                        fgColor="#000000"
                                        level="H"
                                    />
                                )}
                            </Box>
                        </Grid>
                        <Grid size={12}>
                            <Typography sx={{
                                fontWeight: 'bold',
                                color: theme.primaryText,
                                textAlign: 'center'
                            }}>
                                Manual Setup Key
                            </Typography>
                            <Typography sx={{
                                wordBreak: "break-all",
                                color: theme.secondaryText,
                                textAlign: 'center'
                            }}>
                                {secret}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
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
