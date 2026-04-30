import { useState } from "react";

export function useLogin() {
    const [email, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = () => {
        if (!email || !password) {
            setError("Please enter both email and password.");
            return false;
        }

        if (email === "member@gmail.com" && password === "1") {
            setError("");
            return "member";
        } else if (email === "admin@gmail.com" && password === "11") {
            setError("");
            return "admin";
        } else {
            setError("Invalid email or password.");
            return false;
        }
    }
 
    return {
        email,
        password,
        error,
        setMail,
        setPassword,
        handleLogin
    }
}
