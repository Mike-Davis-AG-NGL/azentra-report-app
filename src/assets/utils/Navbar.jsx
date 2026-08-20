import { Box, Grid } from "@mui/material"
import logo from "../images/logo.png"
import { COLORS } from "./colors"
import { Logout } from "@mui/icons-material"
import { ButtonXS } from "./ButtonXS"
import { ButtonX } from "./ButtonX"
import { useNavigate } from "react-router-dom"

export const Navbar = () => {
  const navigate = useNavigate()
  const handleClick = () => {
    localStorage.removeItem('token','user')
    navigate('/')
  }
  return (
    <Box sx={{ flexGrow: 1, bgcolor: COLORS.primaryBg }}>
      <Grid container>
        <Grid size={9}>
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <Grid container>
              <Grid size={{ lg: 1, md: 2, sm: 2, xs: 4 }}>
                <Box sx={{ pr: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
                  <Box component="img" src={logo} alt="Logo" height={{ lg: 70, md: 70, sm: 60, xs: 50 }} />
                </Box>
              </Grid>
              <Grid size={{ lg: 11, md: 10, sm: 10, xs: 8 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%' }}>
                  <Box sx={{ fontWeight: 'bolder', fontStyle: 'italic', color: COLORS.primaryText, fontSize: { lg: 40, md: 40, sm: 35, xs: 25 } }}>
                    Attendance
                  </Box>
                  <Box sx={{ color: COLORS.secondaryText, fontSize: { lg: 20, md: 20, sm: 18, xs: 15 } }}>
                    Tracking Application
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid size={3}>
          <Box sx={{ height: '100%', display: { lg: 'flex', md: 'flex', sm: 'flex', xs: 'none' }, justifyContent: 'flex-end', pr: 2, alignItems: 'center' }}>
            <ButtonX name={"Logout"} theme={COLORS} onClick={handleClick}/>
          </Box>
          <Box sx={{ height: '100%', display: { lg: 'none', md: 'none', sm: 'none', xs: 'flex' }, justifyContent: 'flex-end', pr: 2, alignItems: 'center' }}>
            <ButtonXS name={<Logout />} theme={COLORS} onClick={handleClick}/>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}
