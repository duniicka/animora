import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function Profile() {
  const { user } = useAuth();
  if (!user) return null;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="bg-white border border-orange-100 rounded-2xl shadow p-6">
        <p className="text-gray-700"><span className="font-semibold">Name:</span> {user.firstName || 'User'}</p>
        <p className="text-gray-700"><span className="font-semibold">Email:</span> {user.email}</p>
        <p className="text-gray-700"><span className="font-semibold">Role:</span> {user.role}</p>
      </div>
    </div>
  );
}