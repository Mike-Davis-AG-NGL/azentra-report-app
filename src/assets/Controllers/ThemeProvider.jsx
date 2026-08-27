import { useEffect, useState } from "react";
import { ThemeContext } from "./ThemeContext";

export const ThemeProvider = ({ children }) => {
    const [mode, setMode] = useState(
        localStorage.getItem("themeMode") || "light"
    );

    const toggleTheme = () => {
        setMode((previousMode) =>
            previousMode === "light" ? "dark" : "light"
        );
    };

    useEffect(() => {
        localStorage.setItem("themeMode", mode);
    }, [mode]);

    return (
        <ThemeContext.Provider value={{ mode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};