import { useLocation } from "react-router-dom"
import { Teacher } from "../assets/utils/Teacher/Teacher"
import { Student } from "../assets/utils/Student/Student"
import { Box, Grid } from "@mui/material"

export const Home = () => {
    const location = useLocation()
    const role = location.state?.role

    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container>
                <Grid size={12}>
                    {role === 'teacher' ? <Teacher /> : <Student />}
                </Grid>
            </Grid>
        </Box>
    )
}
