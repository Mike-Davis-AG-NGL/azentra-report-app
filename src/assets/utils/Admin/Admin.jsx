// import React from 'react'
import { Box, Grid } from "@mui/material"
import { useContext } from "react"
import { AdminComponentContext } from "../../Controllers/AdminComponentContext"

export const Admin = () => {
  const { activeComponent } = useContext(AdminComponentContext)
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container>
        <Grid size={12}>
          {activeComponent}
        </Grid>
      </Grid>
    </Box>
  )
}
