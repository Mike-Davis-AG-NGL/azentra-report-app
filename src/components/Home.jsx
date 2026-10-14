import { useLocation } from "react-router-dom"
import { Box, Grid } from "@mui/material"
import { Trainer } from "../assets/utils/Trainer/Trainer"
import { Student } from "../assets/utils/Student/Student"
import { UseTheme } from "../assets/Controllers/UseTheme"

export const Home = () => {
    const theme = UseTheme()
    const location = useLocation()
    const role = location.state?.role || localStorage.getItem('role') || sessionStorage.getItem('role')

    return (
        <Box sx={{ flexGrow: 1, minHeight: '100dvh', height: 'auto', bgcolor: theme.background, overflowY: 'auto' }}>
            <Grid container>
                <Grid size={12}>
                    {role === 'trainer' ? <Trainer /> : role === "student" ? <Student /> : null}
                </Grid>
            </Grid>
        </Box>
    )
}
