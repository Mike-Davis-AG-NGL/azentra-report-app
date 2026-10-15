// import React from 'react'

import { Box, Grid, Typography } from "@mui/material"
import { UseTheme } from "../../Controllers/UseTheme"

export const TrainerProfile = () => {
  const theme = UseTheme()
  return (
    <Box sx={{ flexGrow: 1, p: 2, height: '100dvh', bgcolor: theme.background }}>
      <Grid container>
        <Grid size={12}>
          <Typography variant="h5" sx={{ color: theme.primaryText, fontWeight: "bold", mb: 2 }}>
            Trainer Profile
          </Typography>
        </Grid>
        <Grid size={12}>
          Trainer Head Card
        </Grid>
        <Grid size={{lg:6,md:6,sm:12,xs:12}}>
          Personal Information
        </Grid>
        <Grid size={{lg:6,md:6,sm:12,xs:12}}>
          Professional details
        </Grid>
        <Grid size={12}>
          Performance Overview
        </Grid>
        <Grid size={12}>
          Recent Events
        </Grid>
      </Grid>
    </Box>
  )
}
