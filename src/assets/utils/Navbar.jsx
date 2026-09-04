import { Box, Drawer, Grid } from "@mui/material"
import logo from "../images/logo.png"
import { COLORS, DARKCOLORS } from "./colors"
import { MenuUI } from "./MenuUI"
import { useContext, useState } from "react"
import { NavbarWrapper } from "./styledComponent"
import { useNavigate } from "react-router-dom"
import { ThemeContext } from "../Controllers/ThemeContext"
import { AdminDrawer } from "./Admin/AdminDrawer"

export const Navbar = ({ setActiveComponent }) => {
  const navigate = useNavigate()
  const { mode, toggleTheme } = useContext(ThemeContext)

  const theme = mode === "dark" ? DARKCOLORS : COLORS

  const logout = () => {
    localStorage.removeItem('token', 'user')
    navigate('/')
  }

  // Drawer
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <>
      <NavbarWrapper open={drawerOpen} sx={{ flexGrow: 1, bgcolor: theme.primaryBg, height: '15dvh' }}>
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
                    <Box sx={{ fontWeight: 'bolder', fontStyle: 'italic', color: theme.primaryText, fontSize: { lg: 40, md: 40, sm: 35, xs: 25 } }}>
                      Azentra
                    </Box>
                    <Box sx={{ color: theme.secondaryText, fontSize: { lg: 20, md: 20, sm: 18, xs: 15 } }}>
                      Report App
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
          <Grid size={3}>
            <Box sx={{ height: '100%', display: 'flex', justifyContent: 'flex-end', pr: 4, alignItems: 'center' }}>
              <MenuUI open={drawerOpen} onClick={() => setDrawerOpen(!drawerOpen)} mode={mode}/>
            </Box>
          </Grid>
        </Grid>
        <Drawer variant="persistent" anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <AdminDrawer mode={mode} logout={logout} toggleTheme={toggleTheme} setDrawerOpen={setDrawerOpen} setActiveComponent={setActiveComponent}/>
        </Drawer>
      </NavbarWrapper>
    </>
  )
}
