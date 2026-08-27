import { Box, Divider, Drawer, Grid, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material"
import logo from "../images/logo.png"
import { COLORS } from "./colors"
import { MenuUI } from "./MenuUI"
import { useContext, useState } from "react"
import { Assessment, CoPresent, DarkMode, Dashboard, Event, LightMode, Logout } from "@mui/icons-material"
import { NavbarWrapper } from "./styledComponent"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../Controllers/ThemeContext"

export const Navbar = () => {
  const navigate = useNavigate()
  const { mode, toggleTheme } = useContext(ThemeContext)

  const logout = () => {
    localStorage.removeItem('token', 'user')
    navigate('/')
  }

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false)

  const adminListContents = [
    { icon: <Dashboard />, name: 'Dashboard' },
    { icon: <Event />, name: 'Events' },
    { icon: <CoPresent />, name: 'Resources' },
    { icon: <Assessment />, name: 'Reports' },
  ]

  const AdminDrawerList = (
    <Box sx={{ width: 250, height: '100%', display: 'flex', flexDirection: 'column' }}
      role="presentation" onClick={() => setDrawerOpen(false)}>
      <List>
        {adminListContents.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton>
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
  );

  return (
    <>
      <NavbarWrapper open={drawerOpen} sx={{ flexGrow: 1, bgcolor: COLORS.primaryBg }}>
        <Grid container>
          <Grid size={9}>
            <Box sx={{ flexGrow: 1, p: 2 }}>
              <Grid container>
                <Grid size={{ lg: 1, md: 2, sm: 2, xs: 4 }}>
                  <Box sx={{
                    pr: 2, display: { lg: 'flex', md: 'flex', sm: drawerOpen ? 'none' : 'flex', xs: drawerOpen ? 'none' : 'flex' },
                    justifyContent: 'flex-end', alignItems: 'center', height: '100%'
                  }}>
                    <Box component="img" src={logo} alt="Logo" height={{ lg: 70, md: 70, sm: 60, xs: 50 }} />
                  </Box>
                </Grid>
                <Grid size={{ lg: 11, md: 10, sm: 10, xs: 8 }}>
                  <Box sx={{
                    display: "flex",
                    visibility: { lg: 'visible', md: 'visible', sm: drawerOpen ? 'hidden' : 'visible', xs: drawerOpen ? 'hidden' : 'visible' },
                    flexDirection: 'column', justifyContent: 'center', height: '100%'
                  }}>
                    <Box sx={{ fontWeight: 'bolder', fontStyle: 'italic', color: COLORS.primaryText, fontSize: { lg: 40, md: 40, sm: 35, xs: 25 } }}>
                      Azentra
                    </Box>
                    <Box sx={{ color: COLORS.secondaryText, fontSize: { lg: 20, md: 20, sm: 18, xs: 15 } }}>
                      Report App
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid size={3}>
            <Box sx={{ height: '100%', display: 'flex', justifyContent: 'flex-end', pr: 4, alignItems: 'center' }}>
              <MenuUI open={drawerOpen} onClick={() => setDrawerOpen(!drawerOpen)} />
            </Box>
          </Grid>
        </Grid>
        <Drawer variant="persistent" anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          {AdminDrawerList}
        </Drawer>
      </NavbarWrapper>
    </>
  )
}
