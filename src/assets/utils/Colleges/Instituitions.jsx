// import React from 'react'

import { useContext, useState } from "react"
import { AdminComponentContext } from "../../Controllers/AdminComponentContext"
import { UseTheme } from "../../Controllers/UseTheme"
import { Accordion, AccordionDetails, AccordionSummary, List, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { AccountBalance, Business, ExpandMore, School } from "@mui/icons-material"
import { College } from "./College"
import { Department } from "./Department"

export const Instituitions = ({ setDrawerOpen }) => {
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
            }}>
            <AccordionSummary expandIcon={<ExpandMore sx={{ color: theme.secondaryText }} />}>
                <ListItemIcon>
                    <Business sx={{ color: theme.secondaryText }} />
                </ListItemIcon>
                <ListItemText primary="Institutions" sx={{color: theme.primaryText}}/>
            </AccordionSummary>
            <AccordionDetails sx={{ p: 0 }}>
                <List disablePadding>
                    <ListItemButton
                        sx={{ pl: 9 }}
                        onClick={() => {
                            setActiveComponent(<College />)
                            setDrawerOpen(false)
                        }}
                    >
                        <ListItemIcon>
                            <AccountBalance sx={{ color: theme.secondaryText }} />
                        </ListItemIcon>
                        <ListItemText primary="Colleges" sx={{color: theme.primaryText}}/>
                    </ListItemButton>

                    <ListItemButton
                        sx={{ pl: 9 }}
                        onClick={() => {
                            setActiveComponent(<Department />)
                            setDrawerOpen(false)
                        }}
                    >
                        <ListItemIcon>
                            <School sx={{ color: theme.secondaryText }} />
                        </ListItemIcon>
                        <ListItemText primary="Departments" sx={{color: theme.primaryText}}/>
                    </ListItemButton>
                </List>
            </AccordionDetails>
        </Accordion>
    )
}
