import { Alert, Box, Button, ButtonGroup, Card, CardActions, CardContent, Grid, Link, Snackbar, Typography } from "@mui/material"
import logo from '../assets/images/logo.png'
import teacher from '../assets/images/Teacher.jpg'
import teacherXS from '../assets/images/TeacherMobile.jpg'
import student from '../assets/images/student.jpg'
import studentXS from '../assets/images/studentMobile.jpg'
import { COLORS } from "../assets/utils/colors"
import { InputField } from "../assets/utils/InputField"
import { ButtonX } from "../assets/utils/ButtonX"
import { useState } from "react"
import { CheckBox } from "../assets/utils/CheckBox"
import axios from "axios"
import { useNavigate } from "react-router-dom"

export const Login = () => {
    const navigate = useNavigate()
    const [role, setRole] = useState("teacher")

    // Students field
    const [regNum, setRegNum] = useState('')
    const [stdName, setStdName] = useState('')
    const [dept, setDept] = useState('')
    const [clg, setClg] = useState('')

    // resource person/teacher field
    const [username, setUsername] = useState('')
    const [password, SetPassword] = useState('')
    const [remember, setRemember] = useState(false)

    const [loading, setLoading] = useState(false)

    const image = role === "teacher" ? teacher : student
    const imageXS = role === "teacher" ? teacherXS : studentXS

    // snackbar
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleCloseSnackbar = (_, reason) => {
        if (reason === 'clickaway') return
        setOpenSnackbar(false)
    }

    const handleLogin = async () => {
        if (!username || !password) {
            setSuccess('')
            setError('Invalid Credentials')
            setOpenSnackbar(true)
            return
        }

        setLoading(true)
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username, password, remember
            })

            const token = response.data.token

            if (role !== response.data.user.role) {
                setSuccess('')
                setError(`${username} is not a ${role}`)
                setOpenSnackbar(true)
                return
            }

            remember ? localStorage.setItem('token', token) : sessionStorage.setItem('token', token)

            navigate('/', {
                state: {
                    role: response.data.user.role
                }
            })
        } catch (error) {
            setSuccess('')
            setError(error.response.data.message)
            openSnackbar(true)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Box sx={{ flexGrow: 1, position: 'relative' }}>
            <Box key={role} sx={{
                display: { lg: 'none', md: 'none', sm: 'block', xs: 'none' }, position: 'absolute',
                backgroundImage: `url(${image})`, backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'blur(5px)', zIndex: 0, inset: 0, animation: 'fadeZoom 300ms ease-in-out'
            }}></Box>
            <Box key={role} sx={{
                display: { lg: 'none', md: 'none', sm: 'none', xs: 'block' }, position: 'absolute',
                backgroundImage: `url(${imageXS})`, backgroundSize: 'cover', backgroundPosition: 'center',
                filter: 'blur(5px)', zIndex: 0, inset: 0, animation: 'fadeZoom 300ms ease-in-out'
            }}></Box>
            <Grid container spacing={2} sx={{ zIndex: 1, position: 'relative' }}>
                <Grid size={6} sx={{
                    display: { lg: 'flex', md: 'flex', sm: 'none', xs: 'none' },
                    alignItems: 'center', height: '100vh', overflow: 'hidden', m: 0, p: 0
                }}>
                    <Box sx={{ height: '100%', width: '100%', overflow: 'hidden' }}>
                        <Box key={role} component="img" src={image} alt="Teacher Image" sx={{
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
                                        <Grid size={12} sx={{ pb: 2 }}>
                                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                                                <Box>
                                                    <Typography sx={{ color: COLORS.mutedText, fontWeight: 'bolder' }}>
                                                        Login as
                                                    </Typography>
                                                </Box>
                                                <Box>
                                                    <ButtonGroup variant="contained" sx={{ boxShadow: `0px 6px 24px 0px ${COLORS.shadow}` }}>
                                                        <Button onClick={() => setRole("teacher")} sx={{
                                                            backgroundColor: role === "teacher" ? COLORS.accentHover : COLORS.primaryAccent,
                                                            color: role === "teacher" ? COLORS.primaryAccent : COLORS.primaryText, fontWeight: 'bold',
                                                            '&:hover': {
                                                                backgroundColor: COLORS.accentHover, color: COLORS.primaryAccent
                                                            }
                                                        }}>trainer</Button>
                                                        <Button onClick={() => setRole("student")} sx={{
                                                            backgroundColor: role === "student" ? COLORS.accentHover : COLORS.primaryAccent,
                                                            color: role === "student" ? COLORS.primaryAccent : COLORS.primaryText, fontWeight: 'bold',
                                                            '&:hover': {
                                                                backgroundColor: COLORS.accentHover, color: COLORS.primaryAccent
                                                            }
                                                        }}>student</Button>
                                                    </ButtonGroup>
                                                </Box>
                                            </Box>
                                        </Grid>
                                        {role === 'teacher' && (
                                            <>
                                                <Grid size={12}>
                                                    <Box sx={{ width: '100%' }}>
                                                        <InputField placeholder={"Email"} theme={COLORS}
                                                            value={username} onChange={(e) => setUsername(e.target.value)} />
                                                    </Box>
                                                </Grid>
                                                <Grid size={12}>
                                                    <Box sx={{ width: '100%' }}>
                                                        <InputField placeholder={"Password"} theme={COLORS} mode="password"
                                                            value={password} onChange={(e) => SetPassword(e.target.value)} />
                                                    </Box>
                                                </Grid>
                                                <Grid size={12}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                        <CheckBox theme={COLORS} value={remember} setValue={setRemember} /> Remember Me
                                                    </Box>
                                                </Grid>
                                            </>
                                        )}
                                        {role === 'student' && (
                                            <>
                                                <Grid size={12}>
                                                    <Box sx={{ width: '100%' }}>
                                                        <InputField placeholder={"Register Number"} theme={COLORS}
                                                            value={regNum} onChange={(e) => setRegNum(e.target.value)} />
                                                    </Box>
                                                </Grid>
                                                <Grid size={12}>
                                                    <Box sx={{ width: '100%' }}>
                                                        <InputField placeholder={"Name"} theme={COLORS}
                                                            value={stdName} onChange={(e) => setStdName(e.target.value)} />
                                                    </Box>
                                                </Grid>
                                                <Grid size={12}>
                                                    <Box sx={{ width: '100%' }}>
                                                        <InputField placeholder={"Department"} theme={COLORS}
                                                            value={dept} onChange={(e) => setDept(e.target.value)} />
                                                    </Box>
                                                </Grid>
                                                <Grid size={12}>
                                                    <Box sx={{ width: '100%' }}>
                                                        <InputField placeholder={"College"} theme={COLORS} 
                                                            value={clg} onChange={(e) => setClg(e.target.value)} />
                                                    </Box>
                                                </Grid>
                                            </>
                                        )}
                                    </Grid>
                                </Box>
                            </CardContent><br />
                            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                                <ButtonX name={loading ? "LOGGING..." : "LOGIN"} theme={COLORS} onClick={handleLogin} />
                            </CardActions><br />
                            {/* <CardContent sx={{ pb: 0 }}>
                                <Box sx={{ textAlign: 'center', color: COLORS.secondaryText }}>
                                    For Admin Login <Link href="/admin/login" sx={{
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

