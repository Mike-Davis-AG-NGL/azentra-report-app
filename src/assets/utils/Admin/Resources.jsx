import { useContext, useState } from "react"
import { AdminComponentContext } from "../../Controllers/AdminComponentContext"
import { UseTheme } from "../../Controllers/UseTheme"
import { Accordion, AccordionDetails, AccordionSummary, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { ExpandMore, People, ManageAccounts, Assessment } from "@mui/icons-material"
import { ManageTrainer } from "./ManageTrainer"
import { TrainerPerformance } from "./TrainerPerformance"

export const Resources = ({ setDrawerOpen }) => {
  const { setActiveComponent } = useContext(AdminComponentContext)
  const theme = UseTheme()
  const [expanded, setExpanded] = useState(false)

  return (
    <Accordion
      expanded={expanded}
      onChange={(_, isExpanded) => setExpanded(isExpanded)}
      disableGutters
      elevation={0}
      sx={{
        width: "100%",
        bgcolor: "transparent",
        "&:before": { display: "none" }
      }}
    >
      <AccordionSummary
        expandIcon={
          <ExpandMore sx={{ color: theme.secondaryText }} />
        }
      >
        <ListItemIcon>
          <People sx={{ color: theme.secondaryText }} />
        </ListItemIcon>

        <ListItemText
          primary="Trainer"
          sx={{ color: theme.primaryText }}
        />
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0 }}>
        <List disablePadding>
          <ListItemButton
            sx={{ pl: 9 }}
            onClick={() => {
              setActiveComponent(<ManageTrainer />)
              setDrawerOpen(false)
            }}
          >
            <ListItemIcon>
              <ManageAccounts sx={{ color: theme.secondaryText }} />
            </ListItemIcon>

            <ListItemText
              primary="Manage"
              sx={{ color: theme.primaryText }}
            />
          </ListItemButton>

          <ListItemButton
            sx={{ pl: 9 }}
            onClick={() => {
              setActiveComponent(<TrainerPerformance />)
              setDrawerOpen(false)
            }}
          >
            <ListItemIcon>
              <Assessment sx={{ color: theme.secondaryText }} />
            </ListItemIcon>

            <ListItemText
              primary="Performance"
              sx={{ color: theme.primaryText }}
            />
          </ListItemButton>
        </List>
      </AccordionDetails>
    </Accordion>
  )
}