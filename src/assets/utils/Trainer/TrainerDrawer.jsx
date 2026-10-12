import { AccountBox, Assessment, Comment, DarkMode, Dashboard, Event, Insights, LightMode, Logout } from "@mui/icons-material"
import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { UseTheme } from "../../Controllers/UseTheme"
import { useContext } from "react"
import { TrainerComponentContext } from '../../Controllers/TrainerComponentContext'
import { TrainerDashboard } from "./TrainerDashboard"
import { TrainerEvents } from "./TrainerEvents"
import { TrainerProfile } from "./TrainerProfile"
import { TrainerReport } from "./TrainerReport"
import { TrainerPerformances } from "./TrainerPerformances"
import { TrainerFeedback } from "./TrainerFeedback"

export const TrainerDrawer = ({ mode, toggleTheme, logout, setDrawerOpen }) => {
    const theme = UseTheme()
    const { setActiveComponent } = useContext(TrainerComponentContext)

    const trainerListContents = [
        { icon: <Dashboard sx={{ color: theme.secondaryText }} />, name: 'Dashboard', Component: <TrainerDashboard /> },
        { icon: <Event sx={{ color: theme.secondaryText }} />, name: 'Events', Component: <TrainerEvents /> },
        { icon: <Insights sx={{ color: theme.secondaryText }} />, name: 'Performance', Component: <TrainerPerformances /> },
        { icon: <Comment sx={{ color: theme.secondaryText }} />, name: 'Feedback Summary', Component: <TrainerFeedback /> },
        { icon: <Assessment sx={{ color: theme.secondaryText }} />, name: 'Reports', Component: <TrainerReport /> },
        { icon: <AccountBox sx={{ color: theme.secondaryText }} />, name: 'Profile', Component: <TrainerProfile /> }
    ]

    return (
        <Box
            sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column' }}
            role="presentation"
        >
            <List>
                {trainerListContents.map((item) => (
                    <ListItem key={item.name} disablePadding>
                        <ListItemButton onClick={() => {
                            setActiveComponent(item.Component)
                            setDrawerOpen(false)
                        }}>
                            <ListItemText>
                                {item.icon}
                            </ListItemText>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ flexGrow: 1 }} />
            <Divider />
            <List>
                {[
                    {
                        icon: mode === "light" ? <DarkMode sx={{ color: theme.secondaryText }} /> : <LightMode sx={{ color: theme.secondaryText }} />,
                        name: 'Change Theme', function: toggleTheme
                    },
                    { icon: <Logout sx={{ color: theme.secondaryText }} />, name: 'Logout', function: logout }
                ].map(item => (
                    <ListItem key={item.name} disablePadding>
                        <ListItemButton
                            onClick={() => {
                                item.function()
                                setDrawerOpen(false)
                            }}
                        >
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}