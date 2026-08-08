import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {

            const response = await api.post("/auth/login", {
                email,
                password
            });

            localStorage.setItem(
                "billora_token",
                response.data.token
            );

            localStorage.setItem(
                "billora_user",
                JSON.stringify(response.data.user)
            );

            navigate("/dashboard");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Login failed"
            );

        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <Link to="/" className="auth-logo">
                    Billora
                </Link>

                <h1>Welcome back</h1>

                <p>Sign in to manage your invoices.</p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Email</label>

                    <input
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <label>Password</label>

                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">
                        Sign In
                    </button>

                </form>

                <div className="auth-footer">
                    Don't have an account?
                    <Link to="/register"> Create one</Link>
                </div>

            </div>

        </div>
    );
}

export default Login;