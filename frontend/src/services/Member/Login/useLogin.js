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
            return true;
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
