import { useState } from "react";
import axios from "axios";

export function useLogin() {
    const [email, setMail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        if (!email || !password) {
            setError("Please enter both email and password.");
            return false;
        }

        try {
            const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/admin/sign-in`,
            { email, password },
            {
                withCredentials: true
            }
            );

            const data = res.data;

            localStorage.setItem("accessToken", data.accessToken);

            if (data.status === "INACTIVE") {
                setError("Your account is inactive. Please contact admin.");
                return false;
            }

            if (data.role === "admin") {
                setError("");
                return "admin";
            } else if (data.role === "employee") {
                setError("");
                return "member";
            } else if (data.role === "manager" ) {
                setError("")
                return "manager"
            }

            
            else {
                setError("Unknown user role.");
                return false;
            }

        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
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
