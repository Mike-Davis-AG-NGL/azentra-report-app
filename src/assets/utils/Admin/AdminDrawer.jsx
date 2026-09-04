import { Assessment, CoPresent, DarkMode, Dashboard, Event, LightMode, Logout } from "@mui/icons-material"
import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { AdminDashboard } from "./AdminDashboard"
import { Events } from "./Events"
import { Resources } from "./Resources"
import { Reports } from "./Reports"
import { useContext } from "react"
import { AdminComponentContext } from "../../Controllers/AdminComponentContext"

export const AdminDrawer = ({ mode, toggleTheme, logout, setDrawerOpen }) => {

    const { setActiveComponent } = useContext(AdminComponentContext)

    const adminListContents = [
        { icon: <Dashboard />, name: 'Dashboard', Component: <AdminDashboard /> },
        { icon: <Event />, name: 'Events', Component: <Events /> },
        { icon: <CoPresent />, name: 'Resources', Component: <Resources /> },
        { icon: <Assessment />, name: 'Reports', Component: <Reports /> },
    ]

    return (
        <Box sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column' }}
            role="presentation" onClick={() => setDrawerOpen(false)}>
            <List>
                {adminListContents.map((item) => (
                    <ListItem key={item.name} disablePadding>
                        <ListItemButton onClick={() => {
                            setActiveComponent(item.Component)
                            setDrawerOpen(false)
                        }}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
            <Box sx={{ flexGrow: 1 }} />
            <Divider />
            <List>
                {[
                    { icon: mode === "light" ? <DarkMode /> : <LightMode />, name: 'Theme', function: toggleTheme },
                    { icon: <Logout />, name: 'Logout', function: logout },
                ].map((item) => (
                    <ListItem key={item.name} disablePadding>
                        <ListItemButton onClick={item.function}>
                            <ListItemIcon>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Box>
    )
}
