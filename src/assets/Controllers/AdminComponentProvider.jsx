import { useState } from "react"
import { AdminComponentContext } from "./AdminComponentContext"
import { AdminDashboard } from "../utils/Admin/AdminDashboard"

export const AdminComponentProvider = ({ children }) => {

    const [activeComponent, setActiveComponent] = useState(<AdminDashboard />)

    return (
        <AdminComponentContext.Provider
            value={{
                activeComponent,
                setActiveComponent
            }}
        >
            {children}
        </AdminComponentContext.Provider>
    )
}