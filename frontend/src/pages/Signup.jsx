import React, { useState } from 'react';
import axios from 'axios';
import "./Signup.css";
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        phone: '',
        role: 'User', // default value
        password: ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post('/signup', formData, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            toast.success(response.data.message)
            navigate('/login');
        } catch (err) {
            setError(
                err.response?.data?.error ||
                'Something went wrong. Please try again.'
            );
            toast.error(err.response?.data?.error ||
                'Something went wrong. Please try again.')
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-form-container">
                <h1>Create Account</h1>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit} className="signup-form">
                    <div className="form-group">
                        <label htmlFor="name">Full Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="address">Address</label>
                        <input
                            type="text"
                            id="address"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            required
                            placeholder="Enter your address"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="phone">Phone Number</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            placeholder="Enter your phone number"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="role">Role</label>
                        <select
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="dropdown-select"
                        >
                            <option value="User">User</option>
                            <option value="Admin">Admin</option>
                            <option value="SuperAdmin">Super Admin</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a password"
                            minLength="8"
                        />
                    </div>

                    <button type="submit" className="signup-button" disabled={loading}>
                        {loading ? 'Creating account...' : 'Sign Up'}
                    </button>
                </form>

                <div className="login-link">
                    Already have an account? <a href="/login">Log in</a>
                </div>
            </div>
        </div>
    );
}

export default Signup;
