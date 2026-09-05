// import React from 'react'

import { Box, Grid } from "@mui/material"
import { Admin } from "../assets/utils/Admin/Admin"
import { UseTheme } from "../assets/Controllers/UseTheme"

export const AdminHome = () => {
    const theme = UseTheme()
    return (
        <Box sx={{ flexGrow: 1, height: '100dvh', bgcolor: theme.background }}>
            <Grid container>
                <Grid size={12}>
                    <Admin />
                </Grid>
            </Grid>
        </Box>
    )
}
