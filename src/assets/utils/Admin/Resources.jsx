// import React from 'react'
import { Box, Grid, Tab, Tabs } from "@mui/material"
import { useState } from "react"
import { UseTheme } from '../../Controllers/UseTheme'
import { AddTrainer } from "./AddTrainer"
import { ManageTrainer } from "./ManageTrainer"
import { TrainerPerformance } from "./TrainerPerformance"

export const Resources = () => {
  const theme = UseTheme()
  // Tabs
  const [value, setValue] = useState(0)
  const handleChange = (e, nv) => setValue(nv)
  return (
    <Box sx={{ flexGrow: 1, height: '85dvh' }}>
      <Grid container>
        <Grid size={12}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container>
              <Grid size={12}>
                <Box sx={{ p: 2, bgcolor: theme.primaryBg, display: 'flex', justifyContent: 'center' }}>
                  <Tabs value={value} onChange={handleChange}
                    variant="scrollable" scrollButtons="auto"
                    allowScrollButtonsMobile
                    sx={{
                      "& .MuiTab-root": {
                        color: theme.primaryText, // Normal tab label
                        fontWeight: "bold",
                      },

                      "& .MuiTab-root.Mui-selected": {
                        color: theme.secondaryText, // Selected tab label
                      },

                      "& .MuiTabs-indicator": {
                        backgroundColor: theme.primaryAccent, // Selector/indicator
                        height: "3px",
                      },
                    }}>
                    <Tab label="Add Trainer" />
                    <Tab label="Manage Trainer" />
                    <Tab label="Trainer Performance" />
                  </Tabs>
                </Box>
              </Grid>
              <Grid size={12}>
                <Box sx={{ p: 2 }}>
                  {value === 0 && <AddTrainer />}
                  {value === 1 && <ManageTrainer />}
                  {value === 2 && <TrainerPerformance />}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
