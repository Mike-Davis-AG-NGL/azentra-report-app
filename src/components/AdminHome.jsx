// import React from 'react'

import { Box, Grid } from "@mui/material"
import { Admin } from "../assets/utils/Admin/Admin"
import { UseTheme } from "../assets/Controllers/UseTheme"

export const AdminHome = () => {
    const theme = UseTheme()
    return (
        <Box sx={{ flexGrow: 1, minHeight: '100dvh', height: 'auto', bgcolor: theme.background, overflowY: 'auto' }}>
            <Grid container>
                <Grid size={12}>
                    <Admin />
                </Grid>
            </Grid>
        </Box>
    )
}
