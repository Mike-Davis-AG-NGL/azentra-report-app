// import React from 'react'

import { Box, Grid } from "@mui/material"
import { Admin } from "../assets/utils/Admin"

export const AdminHome = () => {
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container>
                <Grid size={12}>
                    <Admin />
                </Grid>
            </Grid>
        </Box>
    )
}
