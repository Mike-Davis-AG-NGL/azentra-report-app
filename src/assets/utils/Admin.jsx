// import React from 'react'
import { Box, Grid, Typography } from "@mui/material"
import { COLORS } from "./colors"

export const Admin = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid size={12}>
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <Grid container>
              <Grid size={6}>
                <Box sx={{ fontWeight: 'bold', fontStyle:'italic', color: COLORS.primaryText,
                  fontSize: { lg: 25, md: 25, sm: 20, xs: 15 }
                }}>
                  Admin name
                </Box>
              </Grid>
              <Grid size={6}>
                
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid size={12}>

        </Grid>
      </Grid>
    </Box>
  )
}
