import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ProfileModal = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Load current profile on mount
  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/admin/profile`, {
        withCredentials: true,
      })
      .then((res) => {
        setEmail(res.data.email);
      })
      .catch((err) => {
        console.error('Failed to load profile:', err);
        toast.error('Failed to load profile. Please login again.');
        onClose();
      });
  }, [onClose]);

  const handleUpdate = async () => {
    try {
      await axios.put(
        `${API_BASE_URL}/admin/profile`,
        { email, password },
        { withCredentials: true }
      );
      toast.success('Profile updated successfully!');
      onClose();
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Error updating profile');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-md flex justify-center items-center z-50 p-4 transition-all duration-300">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="bg-gray-800/95 border border-gray-700 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">Update Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <input
                type="password"
                value={password}
                placeholder="Leave blank to keep current"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-gray-700/50 text-white border border-gray-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-6">
            <button 
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-700/50 transition-colors"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpdate}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-500 transition-colors"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
