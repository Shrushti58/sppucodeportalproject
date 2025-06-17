import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import AddPracticalForm from '../components/AddPracticalForm';
import AddSubjectForm from '../components/AddSubjectForm';
import SubjectList from '../components/SubjectList';
import PracticalList from '../components/PracticalList';
import ProfileModal from '../components/ProfileModal';
import { useNavigate } from 'react-router-dom';
import AdminSubmissionsReview from '../components/AdminSubmissionsReview'; // adjust path if needed
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const AdminDashboard = () => {
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-gray-800 to-gray-900 shadow-xl border-b border-gray-700 backdrop-blur-sm bg-opacity-90">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-white">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                  Admin Dashboard
                </span>
              </h1>
              <p className="mt-1 md:mt-2 text-sm md:text-base text-gray-300 flex items-center">
                <svg className="w-4 h-4 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Manage your educational content
              </p>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button className="flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors">
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-medium">
                    A
                  </div>
                  <span className="text-gray-200 hidden md:inline-block">Admin</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right border border-gray-700">
                  <button
                    onClick={() => setShowProfileModal(true)}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                  >
                    Your Profile
                  </button>
                 <button
  onClick={async () => {
    try {
      await axios.get(`${API_BASE_URL}/admin/logout`,{ withCredentials: true });
      navigate('/'); // Redirect to login page after logout
    } catch (err) {
      alert('Logout failed');
    }
  }}
  className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 flex items-center"
>
  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
  Logout
</button>


                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <Tabs className="bg-gray-800 rounded-lg shadow-xl overflow-hidden border border-gray-700">
          <TabList className="flex border-b border-gray-700">
            <Tab className="px-6 py-3 text-gray-400 hover:text-blue-400 focus:outline-none border-b-2 border-transparent hover:border-gray-600 ui-selected:border-blue-500 ui-selected:text-blue-400 font-medium transition-colors">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Practicals
              </div>
            </Tab>
            <Tab className="px-6 py-3 text-gray-400 hover:text-blue-400 focus:outline-none border-b-2 border-transparent hover:border-gray-600 ui-selected:border-blue-500 ui-selected:text-blue-400 font-medium transition-colors">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Subjects
              </div>
            </Tab>
            <Tab className="px-6 py-3 text-gray-400 hover:text-blue-400 focus:outline-none border-b-2 border-transparent hover:border-gray-600 ui-selected:border-blue-500 ui-selected:text-blue-400 font-medium transition-colors">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Content
              </div>
            </Tab>
            <Tab className="px-6 py-3 text-gray-400 hover:text-blue-400 focus:outline-none border-b-2 border-transparent hover:border-gray-600 ui-selected:border-blue-500 ui-selected:text-blue-400 font-medium transition-colors">
  <div className="flex items-center">
    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
    Review Submissions
  </div>
</Tab>

          </TabList>

          <TabPanel className="p-6">
            <PracticalList />
          </TabPanel>

          <TabPanel className="p-6">
            <SubjectList />
          </TabPanel>

          <TabPanel>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
                <AddPracticalForm />
              </div>
              <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 shadow-lg">
                <AddSubjectForm />
              </div>
            </div>
          </TabPanel>

          <TabPanel>
  <AdminSubmissionsReview />
</TabPanel>


          
        </Tabs>
      </main>

      {showProfileModal && <ProfileModal onClose={() => setShowProfileModal(false)} />}
    </div>
  );
};

export default AdminDashboard;
