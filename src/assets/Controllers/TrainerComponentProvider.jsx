import { useState } from "react"
import { TrainerDashboard } from '../utils/Trainer/TrainerDashboard'
import { TrainerComponentContext } from "./TrainerComponentContext"

export const TrainerComponentProvider = ({ children }) => {
    const [activeComponent, setActiveComponent] = useState(<TrainerDashboard />)

    return (
        <TrainerComponentContext.Provider value={{ activeComponent, setActiveComponent }}>
            {children}
        </TrainerComponentContext.Provider>
    )
}
