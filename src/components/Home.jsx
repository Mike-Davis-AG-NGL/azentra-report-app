import { useLocation } from "react-router-dom"
import { Box, Grid } from "@mui/material"
import { Trainer } from "../assets/utils/Trainer/Trainer"
import { Student } from "../assets/utils/Student/Student"

export const Home = () => {
    const location = useLocation()
    const role = location.state?.role || localStorage.getItem('role') || sessionStorage.getItem('role')

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container>
                <Grid size={12}>
                    {role === 'trainer' ? <Trainer /> : role === "student" ? <Student /> : null}
                </Grid>
            </Grid>
        </Box>
    )
}
