import { Assessment, CoPresent, DarkMode, Dashboard, Event, LightMode, Logout, ManageAccounts } from "@mui/icons-material"
import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { AdminDashboard } from "./AdminDashboard"
import { Events } from "./Events"
import { Resources } from "./Resources"
import { Reports } from "./Reports"
import { useContext } from "react"
import { AdminComponentContext } from "../../Controllers/AdminComponentContext"
import { AdminAccount } from "./AdminAccount"
import { UseTheme } from "../../Controllers/UseTheme"

export const AdminDrawer = ({ mode, toggleTheme, logout, setDrawerOpen }) => {

    const { setActiveComponent } = useContext(AdminComponentContext)
    const theme = UseTheme()

    const adminListContents = [
        { icon: <Dashboard sx={{ color: theme.secondaryText }} />, name: 'Dashboard', Component: <AdminDashboard /> },
        { icon: <Event sx={{ color: theme.secondaryText }} />, name: 'Events', Component: <Events /> },
        { icon: <CoPresent sx={{ color: theme.secondaryText }} />, name: 'Resources', Component: <Resources /> },
        { icon: <Assessment sx={{ color: theme.secondaryText }} />, name: 'Reports', Component: <Reports /> },
        { icon: <ManageAccounts sx={{ color: theme.secondaryText }} />, name: 'Account Setting', Component: <AdminAccount /> }
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
                    {
                        icon: mode === "light" ? <DarkMode sx={{ color: theme.secondaryText }} /> : <LightMode sx={{ color: theme.secondaryText }} />,
                        name: 'Change Theme', function: toggleTheme
                    },
                    { icon: <Logout sx={{ color: theme.secondaryText }}/>, name: 'Logout', function: logout },
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
