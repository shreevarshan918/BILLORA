import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {

        e.preventDefault();
        setError("");

        try {

            await api.post("/auth/register", {
                name,
                email,
                password
            });

            navigate("/login");

        } catch (error) {

            setError(
                error.response?.data?.message ||
                "Registration failed"
            );

        }
    };

    return (
        <div className="auth-page">

            <div className="auth-card">

                <Link to="/" className="auth-logo">
                    Billora
                </Link>

                <h1>Create your account</h1>

                <p>Start creating professional invoices.</p>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <label>Name</label>

                    <input
                        type="text"
                        placeholder="Your name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />

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
                        placeholder="At least 6 characters"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength="6"
                        required
                    />

                    <button type="submit">
                        Create Account
                    </button>

                </form>

                <div className="auth-footer">
                    Already have an account?
                    <Link to="/login"> Sign in</Link>
                </div>

            </div>

        </div>
    );
}

export default Register;