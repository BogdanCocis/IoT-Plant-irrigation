import React, {useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                "http://localhost:8080/api/login",
                {email, password},
                {withCredentials: true}
            );

            const {id: userId, role} = response.data.courier;

            if (role === "USER") {
                navigate("/userdashboard", {state: {userId, role}});
            } else if (role === "CHILD") {
                navigate("/childdashboard", {state: {userId, role}});
            }
        } catch (error) {
            console.error("Login error:", error);
            setError("Invalid email or password!");
        }
    };

    return (
        <div id="login-body">
            <div className="navbar-login">Log in</div>
            <form className="login-form" onSubmit={handleSubmit}>
                <label className="login-label" htmlFor="email">Email</label>
                <input
                    className="login-input"
                    type="text"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <label className="login-label" htmlFor="password">Password</label>
                <input
                    type="password"
                    id="password"
                    className="login-input"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                {error && <p className="error">{error}</p>}
                <div className="input-button-class">
                    <button type="submit" className="input-button pretty-button">
                        Log in
                    </button>
                </div>
                <p className="center-link">
                    <button
                        className="login-a"
                        type="button"
                        onClick={() => navigate("/Register")}
                    >
                        Don't have an account?
                    </button>
                </p>
            </form>
        </div>
    );
};

export default Login;