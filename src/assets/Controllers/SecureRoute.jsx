import { Navigate, useLocation } from "react-router-dom"

export const SecureRoute = ({ children }) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    const role = localStorage.getItem('user') || sessionStorage.getItem('user')
    const location = useLocation()

    const isAdminRoute = location.pathname === "/admin/login" || location.pathname === "/admin/auth/setup"

    return !token && !isAdminRoute ? <Navigate to='/login' replace /> : 
    role === "admin" && location.pathname === "/" ? <Navigate to='/admin/home' replace /> : children
}
