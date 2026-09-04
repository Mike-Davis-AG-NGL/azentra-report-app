// import React from 'react'

import { Box, Grid, Tab, Tabs } from "@mui/material"
import { useState } from "react"
import { UseTheme } from '../../Controllers/UseTheme'

export const AdminDashboard = () => {
    const theme = UseTheme()
    // Tabs
    const [value, setValue] = useState(0)
    const handleChange = (e, nv) => setValue(nv)
    return (
        <Box sx={{ flexGrow: 1 }}>
            <Grid container>
                <Grid size={12}>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container>
                            <Grid size={12}>
                                <Box sx={{width: '100%', p: 2, bgcolor: theme.primaryBg}}>
                                    <Tabs value={value} onChange={handleChange} variant="fullwidth" centered>
                                        <Tab label="Add Trainer" />
                                        <Tab label="Manage Trainer" />
                                        <Tab label="Trainer Performance" />
                                    </Tabs>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    )
}
