import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import "./Register.css";
import "./Login";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handler = (setField, fieldName, validate) => {
        return function (event) {
            const value = event.target.value;
            setField(value);
            setErrors((prevErrors) => {
                const newErrors = {...prevErrors};
                delete newErrors[fieldName];
                return newErrors;
            });
            if (validate) {
                const error = validate(value);
                if (error) {
                    setErrors((prevErrors) => ({
                        ...prevErrors,
                        [fieldName]: error,
                    }));
                }
            }
        };
    };

    const validateName = (name) => {
        return /^[a-zA-Z]{2,}([ -][a-zA-Z]{2,})+$/.test(name)
            ? ""
            : "Enter a valid name";
    };

    const validateEmail = (email) => {
        return /^[a-zA-Z0-9._]+(?<!\.)@[a-zA-Z]+\.[a-zA-Z]+$/.test(email)
            ? ""
            : "Enter a valid email";
    };

    const validatePassword = (password) => {
        return password.length >= 8 &&
        password.length <= 12 &&
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%#^<>*?&.,/{}\s]{8,12}$/.test(
            password
        )
            ? ""
            : "The password must contain between 8 and 12 characters, including at least one uppercase letter, one lowercase letter, and one number";
    };

    const getFieldValue = (object, fieldName) => {
        return object[fieldName];
    };

    const fields = [
        {
            label: "Name",
            type: "text",
            value: name,
            id: "name",
            handler: handler(setName, "name", validateName),
            error: "name",
        },
        {
            label: "Email",
            type: "text",
            value: email,
            id: "email",
            handler: handler(setEmail, "email", validateEmail),
            error: "email",
        },
        {
            label: "Password",
            type: "password",
            value: password,
            id: "password",
            handler: handler(setPassword, "password", validatePassword),
            error: "password",
        },
        {
            label: "Confirm Password",
            type: "password",
            value: confirmPassword,
            id: "confirmPassword",
            handler: handler(setConfirmPassword, "confirmPassword", validatePassword),
            error: "confirmPassword",
        },
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        const nameError = validateName(name);
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (nameError) {
            newErrors.name = nameError;
        }

        if (emailError) {
            newErrors.email = emailError;
        }

        if (password !== confirmPassword) {
            newErrors.password = "The passwords aren't the same";
        }

        if (passwordError) {
            newErrors.password = passwordError;
        }

        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            try {
                const response = await fetch("http://localhost:8080/api/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        name,
                        email,
                        password,
                    }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    const serverErrors = {};
                    if (errorData.error.includes("Email is already in use!")) {
                        serverErrors.email = "This email is already registered.";
                    }
                    setErrors(serverErrors);
                } else {
                    await response.json();
                    navigate("/login");
                }
            } catch (error) {
                console.error("Error during registration:", error);
            }
        }
    };

    return (
        <div id="body-register">
            <h1 className="navbar-register">Register</h1>
            <div className="container-register">
                <form className="Register" onSubmit={handleSubmit}>
                    {fields.map(({label, type, value, id, handler, error}) => (
                        <div key={label}>
                            <label id="label-register">{label}</label>
                            <input
                                className="input-register"
                                type={type}
                                value={value}
                                id={id}
                                onChange={handler}
                            />
                            {getFieldValue(errors, error) && (
                                <div className="error">{getFieldValue(errors, error)}</div>
                            )}
                        </div>
                    ))}
                    <div className="button-register">
                        <button id="button-register">Submit</button>
                    </div>
                    <p className="center-link-register">
                        <button className="register-a" onClick={() => navigate("/")}>
                            Do you have an account?
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Register;