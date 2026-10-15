// import React from 'react'

import { AdminPanelSettings, Delete, Download, WarningAmber } from "@mui/icons-material"
import { Alert, Avatar, Box, Button, Card, CardActions, CardContent, Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader, Snackbar, Typography } from "@mui/material"
import { UseTheme } from "../../Controllers/UseTheme"
import { useEffect, useRef, useState } from "react"
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

    const [adminId, setAdminId] = useState('')
    const [loading, setLoading] = useState(true)
    const [downloading, setDownloading] = useState(false)
    const [deleteDialog, setDeleteDialog] = useState(false)
    const [deleting, setDeleting] = useState(false)

    // snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleCloseSnackbar = (_, reason) => {
        if (reason === 'clickaway') return
        setOpenSnackbar(false)
    }

    useEffect(() => {
        const loadAccount = async () => {
            const token = localStorage.getItem("token")

            if (!token) {
                navigate("/admin/login", { replace: true })
                return
            }

            try {
                const response = await axios.get(
                    "http://localhost:5000/api/admin/account/details",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                )

                if (!response.data.success) {
                    throw new Error(response.data.message)
                }

                const account = response.data.account

                setAdminId(account.id)
                setAdminEmail(account.email)
                setSecret(account.totp)
                setQrUri(account.qr_uri)
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    err.message ||
                    "Error loading account"
                )
                setSuccess('')
                setOpenSnackbar(true)
            } finally {
                setLoading(false)
            }
        }

        loadAccount()
    }, [navigate])

    const downloadAccount = async () => {
        if (downloading) return
        setDownloading(true)
        const token = localStorage.getItem('token')
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
        } finally {
            setDownloading(false)
        }
    }

    const deleteAccount = async () => {
        if (deleting) return
        setDeleting(true)

        try {
            const token = localStorage.getItem("token")
            const response = await axios.delete("http://localhost:5000/api/admin/delete/account", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            if (!response.data.success) {
                setSuccess("")
                setError(response.data.message || "Unable to delete account")
                openSnackbar(true)
            }
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            sessionStorage.clear()

            setDeleteDialog(false)
            navigate("/admin/login", { replace: true })
        } catch (error) {
            setSuccess('')
            setError(error.response?.data?.message || error.message || "Error deleting account")
            setOpenSnackbar(true)
        } finally {
            setDeleting(false)
        }
    }

    return (
        <Box sx={{ flexGrow: 1, height: '100dvh', bgcolor: theme.background }}>
            <Grid container>
                <Grid size={12}>
                    <Box>
                        <Card sx={{ mb: 2, bgcolor: theme.cardBg, borderColor: theme.cardBorder }}>
                            <CardContent>
                                <Box sx={{ flexGrow: 1 }}>
                                    <Grid container>
                                        <Grid size={12}>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Grid container>
                                                    <Grid size={12}>
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Grid container>
                                                                <Grid size={0.5}>
                                                                    <Box>
                                                                        <Avatar sx={{ p: 2, bgcolor: theme.primaryAccent, color: theme.primaryText }}>
                                                                            <AdminPanelSettings sx={{ fontSize: '55px' }} />
                                                                        </Avatar>
                                                                    </Box>
                                                                </Grid>
                                                                <Grid size={11.5}>
                                                                    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', px: { lg: 4, md: 6, sm: 7, xs: 9 } }}>
                                                                        <Typography variant="h6" sx={{ color: theme.primaryText, fontWeight: 'bold', textOverflow: 'scroll' }}>
                                                                            Admin Profile
                                                                        </Typography>
                                                                        <Typography sx={{ color: theme.secondaryText }}>
                                                                            Azentra Global
                                                                        </Typography>
                                                                    </Box>
                                                                </Grid>
                                                            </Grid>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                        <Grid size={12}>
                                            <Box sx={{ p: 1 }}>
                                                <Typography variant="h6" sx={{ color: theme.primaryText, fontWeight: 'bold' }}>
                                                    Account Information
                                                </Typography>
                                            </Box>
                                            <Box sx={{ flexGrow: 1 }}>
                                                <Grid container>
                                                    <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                                                        <Box sx={{ p: 1 }}>
                                                            <Card sx={{ bgcolor: theme.cardBg, borderColor: theme.cardBorder }}>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex', alignItems: { lg: 'flex-start', md: 'flex-start', sm: 'center', xs: 'center' },
                                                                        justifyContent: 'center', flexDirection: 'column', p: 2
                                                                    }}>
                                                                    <Typography sx={{ color: theme.secondaryText }}>
                                                                        Admin ID
                                                                    </Typography>
                                                                    <Typography variant="h6" sx={{ color: theme.primaryText, fontWeight: 'bold' }}>
                                                                        {adminId || "—"}
                                                                    </Typography>
                                                                </Box>
                                                            </Card>
                                                        </Box>
                                                    </Grid>
                                                    <Grid size={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
                                                        <Box sx={{ p: 1 }}>
                                                            <Card sx={{ bgcolor: theme.cardBg, borderColor: theme.cardBorder }}>
                                                                <Box
                                                                    sx={{
                                                                        display: 'flex', alignItems: { lg: 'flex-start', md: 'flex-start', sm: 'center', xs: 'center' },
                                                                        justifyContent: 'center', flexDirection: 'column', p: 2
                                                                    }}>
                                                                    <Typography sx={{ color: theme.secondaryText }}>
                                                                        Admin Mail
                                                                    </Typography>
                                                                    <Typography variant="h6" sx={{ color: theme.primaryText, fontWeight: 'bold', textOverflow: 'scroll' }}>
                                                                        {adminEmail || "—"}
                                                                    </Typography>
                                                                </Box>
                                                            </Card>
                                                        </Box>
                                                    </Grid>
                                                </Grid>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </CardContent>
                            <CardActions>
                                <List sx={{
                                    width: '100%',
                                    bgcolor: theme.cardBg,
                                    color: theme.primaryText,
                                    '& .MuiListSubheader-root': {
                                        bgcolor: theme.cardBg,
                                        color: theme.primaryText,
                                    },
                                    '& .MuiListItemButton-root': {
                                        color: theme.primaryText,
                                        borderRadius: 1,
                                        transition: 'background-color 0.2s ease',
                                        '&:hover': {
                                            bgcolor: theme.primaryBg,
                                        },
                                        '&.Mui-disabled': {
                                            opacity: 0.6,
                                        },
                                    },
                                    '& .MuiListItemIcon-root': {
                                        color: theme.primaryText,
                                        minWidth: 42,
                                    },
                                    '& .MuiListItemText-primary': {
                                        color: theme.primaryText,
                                        fontWeight: 600,
                                    },
                                    '& .MuiListItemText-secondary': {
                                        color: theme.secondaryText,
                                    },
                                }}
                                    subheader={
                                        <ListSubheader component="div" id="nested-list-subheader" sx={{ color: theme.primaryText, fontWeight: 'bold', fontSize: '20px' }}>
                                            Account Settings
                                        </ListSubheader>
                                    }
                                >
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            onClick={downloadAccount}
                                            disabled={loading || downloading || deleting}
                                        >
                                            <ListItemIcon>
                                                <Download sx={{ color: theme.primaryText }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Download Profile" secondary="Download account information." />
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            onClick={() => setDeleteDialog(true)}
                                            disabled={loading || deleting}
                                        >
                                            <ListItemIcon>
                                                <Delete sx={{ color: theme.error }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Delete Profile" secondary="Delete the admin account after confirmation." />
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </CardActions>
                        </Card>
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
            <Dialog
                open={deleteDialog}
                onClose={() => {
                    if (!deleting) setDeleteDialog(false)
                }}
                fullWidth
                maxWidth="xs"
                PaperProps={{
                    sx: {
                        bgcolor: theme.cardBg,
                        color: theme.primaryText
                    }
                }}
            >
                <DialogTitle sx={{ fontWeight: "bold" }}>
                    <WarningAmber
                        sx={{ color: theme.error, verticalAlign: "middle", mr: 1 }}
                    />
                    Delete Admin Account?
                </DialogTitle>

                <DialogContent>
                    <DialogContentText sx={{ color: theme.secondaryText }}>
                        Are you sure you want to permanently delete this admin
                        account? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>

                <DialogActions sx={{ p: 2 }}>
                    <Button
                        onClick={() => setDeleteDialog(false)}
                        disabled={deleting}
                        sx={{ color: theme.secondaryText }}
                    >
                        Cancel
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        onClick={deleteAccount}
                        disabled={deleting}
                    >
                        {deleting ? "Deleting..." : "Delete Account"}
                    </Button>
                </DialogActions>
            </Dialog>
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
