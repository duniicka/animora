import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    return (
        <div className="dashboard">
            <h1>Admin Dashboard</h1>
            <div className="dashboard-links">
                <Link to="/admin/manage-pets" className="dashboard-link">Manage Pets</Link>
                <Link to="/admin/manage-users" className="dashboard-link">Manage Users</Link>
            </div>
        </div>
    );
};

export default AdminDashboard;