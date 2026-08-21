import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { Login } from "./components/Login"
import { SecureRoute } from "./assets/Controllers/SecureRoute"
import { Navbar } from "./assets/utils/Navbar"
import { NavBarAll } from "./assets/utils/NavBarAll"
import { Home } from "./components/Home"
import { AdminLogin } from "./components/AdminLogin"
import { AdminRegister } from "./components/AdminRegister"
import { AdminHome } from "./components/AdminHome"

const Content = () => {
  const location = useLocation()

  const navbar = ['/', '/admin/']
  // const navbarAll = ['/admin/add/class', '/admin/add/student', '/admin/add/teacher']
  const showNavbar = navbar.includes(location.pathname)
  // const showNavbarAll = navbarAll.includes(location.pathname)

  return (
    <>
      {showNavbar && <Navbar />}
      {/* {showNavbarAll && <NavBarAll />} */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/auth/setup" element={<AdminRegister />} />
        <Route path="/admin/" element={
          <SecureRoute>
            <AdminHome />
          </SecureRoute>
        } />
        <Route path="/" element={
          <SecureRoute>
            <Home />
          </SecureRoute>
        } />
      </Routes>
    </>
  )
}

export const App = () => {
  return (
    <Router>
      <Content />
    </Router>
  )
}
