import { Navigate, useLocation } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import { useState } from "react"

export const SecureRoute = ({ children }) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token')
    const role = localStorage.getItem('user') || sessionStorage.getItem('user')
    const location = useLocation()

    const isAdminRoute = location.pathname === "/admin/login" || location.pathname === "/admin/auth/setup"
    const isAdminPath = location.pathname.startsWith("/admin")

    const [isTokenExpired] = useState(() => {
        if (!token) return false

        try {
            const decoded = jwtDecode(token)
            return decoded.exp < Date.now() / 1000
        } catch {
            return true
        }
    })

    if (isTokenExpired) {
        localStorage.removeItem('token', 'user')
        sessionStorage.removeItem('token', 'user')

        return (
            <Navigate
                to={isAdminPath ? '/admin/login' : '/login'}
                replace
            />
        )
    }

    return !token && !isAdminRoute ? <Navigate to={isAdminPath ? '/admin/login' : '/login'} replace /> :
        role === "admin" && location.pathname === "/" ? <Navigate to='/admin/' replace /> : children
}
