import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../constants'; // Adjust the import path as necessary
import "../styles/register.css";  // Assuming you want to use the same CSS file for both

function Register() {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formDetails, setFormDetails] = useState({
        firstname: '',
        lastname: '',
        email: '',
        password: '',
        confpassword: ''
    });
    const navigate = useNavigate();

    const inputChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            setFile(files[0]);
        } else {
            setFormDetails((prev) => ({ ...prev, [name]: value }));
        }
    };

    const formSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        const { firstname, lastname, email, password, confpassword } = formDetails;
        if (!firstname || !lastname || !email || !password || !confpassword) {
            toast.error("Please fill in all fields");
            return;
        }
        if (password !== confpassword) {
            toast.error("Passwords do not match");
            return;
        }

        const formData = new FormData();
        formData.append('firstname', firstname);
        formData.append('lastname', lastname);
        formData.append('email', email);
        formData.append('password', password);
        if (file) {
            formData.append('pic', file);
        }

        setLoading(true);
        try {
            await axios.post(`${API_BASE_URL}/api/user/register`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success("User registered successfully");
            navigate("/login");
        } catch (error) {
            console.error("Error during registration:", error);
            toast.error(`Registration failed: ${error.response?.data || "Unknown error"}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="register-section flex-center">
            <div className="register-container flex-center">
                <h2 className="form-heading">Sign Up</h2>
                <form onSubmit={formSubmit} className="register-form">
                    <input
                        type="text"
                        name="firstname"
                        className="form-input"
                        placeholder="Enter your first name"
                        onChange={inputChange}
                    />
                    <input
                        type="text"
                        name="lastname"
                        className="form-input"
                        placeholder="Enter your last name"
                        onChange={inputChange}
                    />
                    <input
                        type="email"
                        name="email"
                        className="form-input"
                        placeholder="Enter your email"
                        onChange={inputChange}
                    />
                    <input
                        type="file"
                        onChange={inputChange}
                        name="pic"
                        id="profile-pic"
                        className="form-input"
                    />
                    <input
                        type="password"
                        name="password"
                        className="form-input"
                        placeholder="Enter your password"
                        onChange={inputChange}
                    />
                    <input
                        type="password"
                        name="confpassword"
                        className="form-input"
                        placeholder="Confirm your password"
                        onChange={inputChange}
                    />
                    <button
                        type="submit"
                        className="btn form-btn"
                        disabled={loading ? true : false}
                    >
                        Sign Up
                    </button>
                </form>
                <p>
                    Already a user?{" "}
                    <NavLink className="login-link" to={"/login"}>
                        Log in
                    </NavLink>
                </p>
            </div>
        </section>
    );
}

export default Register;
