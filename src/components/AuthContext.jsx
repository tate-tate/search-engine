import { createContext, useState, useMemo, useCallback } from "react";

export const AuthContext = createContext(); // Use a named export for AuthContext

export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin") === "true");

    const login = useCallback(() => {
        setIsLogin(true);
        localStorage.setItem("isLogin", "true");
    }, []);

    const logout = useCallback(() => {
        fetch("https://web.ics.purdue.edu/~shaverb/390final/logout.php")
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    setIsLogin(false);
                    localStorage.setItem("isLogin", "false");
                } else {
                    console.log("Unexpected response:", data);
                }
            })
            .catch((error) => {
                console.log("Logout failed:", error);
                setIsLogin(false); // Fallback to ensure logout state
                localStorage.setItem("isLogin", "false");
            });
    }, []);

    const value = useMemo(() => ({ isLogin, login, logout }), [isLogin, login, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};