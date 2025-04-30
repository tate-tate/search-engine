import { createContext, useState, useMemo, useCallback } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLogin, setIsLogin] = useState(localStorage.getItem("isLogin") === "true");
    const [userID, setUserID] = useState(localStorage.getItem("userID")); // Retrieve userID from localStorage

    console.log("AuthContext initialized. isLogin:", isLogin, "userID:", userID); // Debugging log
    console.log("LocalStorage userID:", localStorage.getItem("userID")); // Debugging log

    const login = useCallback((userID) => {
        console.log("Login called with userID:", userID); // Debugging log
        setIsLogin(true);
        setUserID(userID);
        localStorage.setItem("isLogin", "true");
        localStorage.setItem("userID", userID); // Store userID in localStorage
    }, []);

    const logout = useCallback(() => {
        fetch("https://web.ics.purdue.edu/~shaverb/390final/logout.php")
            .then((response) => response.json())
            .then((data) => {
                if (data.message) {
                    setIsLogin(false);
                    setUserID(null);
                    localStorage.removeItem("isLogin");
                    localStorage.removeItem("userID");
                } else {
                    console.error("Unexpected response during logout:", data);
                }
            })
            .catch((error) => {
                console.error("Logout failed:", error);
                setIsLogin(false);
                setUserID(null);
                localStorage.removeItem("isLogin");
                localStorage.removeItem("userID");
            });
    }, []);

    const value = useMemo(() => ({ isLogin, userID, login, logout }), [isLogin, userID, login, logout]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};