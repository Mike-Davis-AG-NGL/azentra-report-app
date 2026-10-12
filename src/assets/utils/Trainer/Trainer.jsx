import { Box, Grid } from "@mui/material"
import { useContext } from "react"
import { TrainerComponentContext } from "../../Controllers/TrainerComponentContext"

export const Trainer = () => {
  const { activeComponent } = useContext(TrainerComponentContext)
  return (
    <Box sx={{ flexGrow: 1, height: '100%' }}>
      <Grid container>
        <Grid size={12}>
          {activeComponent}
        </Grid>
      </Grid>
    </Box>
  )
}
