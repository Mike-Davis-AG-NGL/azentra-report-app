import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom"
import { Login } from "./components/Login"
import { SecureRoute } from "./assets/Controllers/SecureRoute"
import { Navbar } from "./assets/utils/Navbar"
import { NavBarAll } from "./assets/utils/NavBarAll"
import { Home } from "./components/Home"
import { AdminLogin } from "./components/AdminLogin"
import { AdminRegister } from "./components/AdminRegister"
import { AdminHome } from "./components/AdminHome"
import { AddClass } from "./assets/utils/AddClass"
import { AddStudent } from "./assets/utils/AddStudent"
import { AddTeacher } from "./assets/utils/AddTeacher"

const Content = () => {
  const location = useLocation()

  const navbar = ['/', '/admin/home']
  const navbarAll = ['/add/class', '/add/student', '/add/teacher']
  const showNavbar = navbar.includes(location.pathname)
  const showNavbarAll = navbarAll.includes(location.pathname)

  return (
    <>
      {showNavbar && <Navbar />}
      {showNavbarAll && <NavBarAll />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/auth/setup" element={<AdminRegister />} />
        <Route path="/admin/home" element={
          <SecureRoute>
            <AdminHome />
          </SecureRoute>
        } />
        <Route path="/" element={
          <SecureRoute>
            <Home />
          </SecureRoute>
        } />
        <Route path="/add/class" element={
          <SecureRoute>
            <AddClass />
          </SecureRoute>
        } />
        <Route path="/add/student" element={
          <SecureRoute>
            <AddStudent />
          </SecureRoute>
        } />
        <Route path="/add/teacher" element={
          <SecureRoute>
            <AddTeacher />
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
