import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    ChevronDown,
    ChevronUp,
    Edit,
    Trash,
    Plus,
    X,
    Check,
    Search,
    RefreshCw
} from 'lucide-react';
import './user_management.css';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingUser, setEditingUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        address: '',
        phone: ''
    });
    const [isCreating, setIsCreating] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'id', direction: 'ascending' });

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get('/users');
            setUsers(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch users. Please try again later.');
            console.error('Error fetching users:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(`/users/${id}`);
                setUsers(users.filter(user => user.id !== id));
            } catch (err) {
                setError('Failed to delete user. Please try again.');
                console.error('Error deleting user:', err);
            }
        }
    };

    const handleEdit = (user) => {
        setEditingUser(user.id);
        setFormData({
            name: user.name,
            email: user.email,
            address: user.address,
            phone: user.phone
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdate = async () => {
        try {
            await axios.put(`/users/${editingUser}`, formData);
            setUsers(users.map(user =>
                user.id === editingUser ? { ...user, ...formData } : user
            ));
            setEditingUser(null);
        } catch (err) {
            setError('Failed to update user. Please try again.');
            console.error('Error updating user:', err);
        }
    };

    const handleCreate = async () => {
        try {
            const response = await axios.post('/users', formData);
            setUsers([...users, response.data]);
            setIsCreating(false);
            setFormData({
                name: '',
                email: '',
                address: '',
                phone: ''
            });
        } catch (err) {
            setError('Failed to create user. Please try again.');
            console.error('Error creating user:', err);
        }
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortedUsers = () => {
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm)
        );

        return [...filtered].sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
            }
            if (a[sortConfig.key] > b[sortConfig.key]) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
            }
            return 0;
        });
    };

    const getSortIndicator = (key) => {
        if (sortConfig.key === key) {
            return sortConfig.direction === 'ascending' ?
                <ChevronUp className="icon inline-icon" /> :
                <ChevronDown className="icon inline-icon" />;
        }
        return null;
    };

    return (
        <div className="container">
            <div className="card">
                <div className="header">
                    <h1 className="header-title">User Management</h1>
                    <div className="button-group">
                        <button
                            onClick={() => {
                                setIsCreating(true);
                                setFormData({
                                    name: '',
                                    email: '',
                                    address: '',
                                    phone: ''
                                });
                            }}
                            className="button button-white"
                        >
                            <Plus className="icon" /> Add User
                        </button>
                        <button
                            onClick={fetchUsers}
                            className="button button-primary"
                        >
                            <RefreshCw className="icon" /> Refresh
                        </button>
                    </div>
                </div>

                {/* Search bar */}
                <div className="search-container">
                    <div className="search-wrapper">
                        <Search className="search-icon icon" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="search-input"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {/* Error message */}
                {error && (
                    <div className="alert alert-error" role="alert">
                        <p>{error}</p>
                    </div>
                )}

                {/* Create user form */}
                {isCreating && (
                    <div className="form-container">
                        <h2 className="form-title">Add New User</h2>
                        <div className="form-grid">
                            <div className="form-group">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            </div>
                        </div>
                        <div className="form-actions">
                            <button
                                onClick={() => setIsCreating(false)}
                                className="button button-gray"
                            >
                                <X className="icon" /> Cancel
                            </button>
                            <button
                                onClick={handleCreate}
                                className="button button-success"
                            >
                                <Check className="icon" /> Save
                            </button>
                        </div>
                    </div>
                )}

                {/* User table */}
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th onClick={() => requestSort('id')}>
                                    ID {getSortIndicator('id')}
                                </th>
                                <th onClick={() => requestSort('name')}>
                                    Name {getSortIndicator('name')}
                                </th>
                                <th onClick={() => requestSort('email')}>
                                    Email {getSortIndicator('email')}
                                </th>
                                <th>Address</th>
                                <th>Phone</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="6">
                                        <div className="loading-container">
                                            <div className="spinner"></div>
                                            <span>Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : getSortedUsers().length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="empty-message">
                                        No users found
                                    </td>
                                </tr>
                            ) : (
                                getSortedUsers().map(user => (
                                    <tr key={user.id}>
                                        <td className="text-primary">
                                            {user.id}
                                        </td>
                                        <td className="text-primary">
                                            {editingUser === user.id ? (
                                                <input
                                                    type="text"
                                                    name="name"
                                                    value={formData.name}
                                                    onChange={handleInputChange}
                                                    className="form-input"
                                                />
                                            ) : (
                                                user.name
                                            )}
                                        </td>
                                        <td className="text-primary">
                                            {editingUser === user.id ? (
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="form-input"
                                                />
                                            ) : (
                                                user.email
                                            )}
                                        </td>
                                        <td className="text-secondary">
                                            {editingUser === user.id ? (
                                                <input
                                                    type="text"
                                                    name="address"
                                                    value={formData.address}
                                                    onChange={handleInputChange}
                                                    className="form-input"
                                                />
                                            ) : (
                                                user.address
                                            )}
                                        </td>
                                        <td className="text-secondary">
                                            {editingUser === user.id ? (
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    value={formData.phone}
                                                    onChange={handleInputChange}
                                                    className="form-input"
                                                />
                                            ) : (
                                                user.phone
                                            )}
                                        </td>
                                        <td>
                                            {editingUser === user.id ? (
                                                <div className="table-actions">
                                                    <X
                                                        className="icon-md action-icon cancel-icon"
                                                        onClick={() => setEditingUser(null)}
                                                    />
                                                    <Check
                                                        className="icon-md action-icon confirm-icon"
                                                        onClick={handleUpdate}
                                                    />
                                                </div>
                                            ) : (
                                                <div className="table-actions">
                                                    <Edit
                                                        className="icon-md action-icon edit-icon"
                                                        onClick={() => handleEdit(user)}
                                                    />
                                                    <Trash
                                                        className="icon-md action-icon delete-icon"
                                                        onClick={() => handleDelete(user.id)}
                                                    />
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="footer">
                    <p className="footer-text">
                        Showing {getSortedUsers().length} users
                    </p>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;