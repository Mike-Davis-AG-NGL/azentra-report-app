import { Assessment, CoPresent, DarkMode, Dashboard, Event, LightMode, Logout, ManageAccounts } from "@mui/icons-material"
import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import { AdminDashboard } from "./AdminDashboard"
import { AdminEvents } from "./AdminEvents"
import { Resources } from "./Resources"
import { AdminReports } from "./AdminReports"
import { useContext } from "react"
import { AdminComponentContext } from "../../Controllers/AdminComponentContext"
import { AdminAccount } from "./AdminAccount"
import { UseTheme } from "../../Controllers/UseTheme"
import { Instituitions } from "../Colleges/Instituitions"

export const AdminDrawer = ({ mode, toggleTheme, logout, setDrawerOpen }) => {
    const { setActiveComponent } = useContext(AdminComponentContext)
    const theme = UseTheme()

    const adminListContents = [
        { icon: <Dashboard sx={{ color: theme.secondaryText }} />, name: 'Dashboard', Component: <AdminDashboard /> },
        { icon: <Event sx={{ color: theme.secondaryText }} />, name: 'Events', Component: <AdminEvents /> },
        { name: 'Instituitions', Component: <Instituitions setDrawerOpen={setDrawerOpen} />, isAccordion: true },
        { icon: <CoPresent sx={{ color: theme.secondaryText }} />, name: 'Resources', Component: <Resources /> },
        { icon: <Assessment sx={{ color: theme.secondaryText }} />, name: 'Reports', Component: <AdminReports /> },
        { icon: <ManageAccounts sx={{ color: theme.secondaryText }} />, name: 'Account Setting', Component: <AdminAccount /> }
    ]

    return (
        <Box sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column' }}
            role="presentation" onClick={() => setDrawerOpen(false)}>
            <List>
                {adminListContents.map((item) => (
                    <ListItem key={item.name} disablePadding>
                        {item.isAccordion ? (
                            <Box sx={{ width: "100%" }} onClick={(event) => event.stopPropagation()}>
                                {item.Component}
                            </Box>
                        ) : (
                            <ListItemButton onClick={() => {
                                setActiveComponent(item.Component)
                                setDrawerOpen(false)
                            }}>
                                <ListItemIcon>
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText primary={item.name} />
                            </ListItemButton>
                        )}
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
                    { icon: <Logout sx={{ color: theme.secondaryText }} />, name: 'Logout', function: logout },
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
        </Box >
    )
}
