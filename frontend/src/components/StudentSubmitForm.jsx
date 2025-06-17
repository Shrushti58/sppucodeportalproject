import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { FiSend, FiCode, FiBook, FiUser, FiMail, FiFileText, FiGithub } from 'react-icons/fi';
import { Link, useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const StudentSubmitForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    title: '',
    description: '',
    code: '',
    extension: '.py'
  });
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState('');
  const [statusType, setStatusType] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/subjects`);
        setSubjects(res.data);
      } catch (err) {
        console.error('Failed to load subjects', err);
      }
    };
    fetchSubjects();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setStatusType('');
    setIsSubmitting(true);

    try {
      await axios.post(`${API_BASE_URL}/submissions`, formData);
      setMessage('Submission sent successfully! Redirecting...');
      setStatusType('success');
      
      setFormData({
        name: '',
        email: '',
        subject: '',
        title: '',
        description: '',
        code: '',
        extension: '.py'
      });

      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setMessage('Submission failed. Please check your input and try again.');
      setStatusType('error');
      console.error('Submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Enhanced Navbar */}
      <nav className="bg-gray-800/80 backdrop-blur-md border-b border-gray-700 fixed w-full z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center text-xl font-bold group">
            <FiGithub className="mr-2 text-blue-400 group-hover:text-blue-300 transition-colors" />
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              SPPU CodePortal
            </span>
          </Link>
          
          <Link to="/">
            <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/20">
              <span>Back to Home</span>
            </button>
          </Link>
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 flex justify-center items-start pt-24">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-800/70 p-8 rounded-2xl shadow-xl w-full max-w-3xl space-y-6 border border-gray-700 backdrop-blur-sm hover:shadow-2xl transition-shadow duration-300"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
              Submit Your Practical
            </h2>
            <p className="text-gray-400 mt-2">
              Fill out the form below to submit your code for review
            </p>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg border-l-4 ${
                statusType === 'success'
                  ? 'bg-green-900/30 text-green-300 border-green-500'
                  : 'bg-red-900/30 text-red-300 border-red-500'
              } animate-fade-in`}
            >
              {message}
            </div>
          )}

          {/* Form Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <FiUser className="mr-2 text-blue-400" /> Name *
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Your full name"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <FiMail className="mr-2 text-blue-400" /> Email *
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Your email address"
              />
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300 flex items-center">
                <FiBook className="mr-2 text-blue-400" /> Subject *
              </label>
              <select
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all duration-200"
              >
                <option value="">Select a subject</option>
                {subjects.map((subject) => (
                  <option key={subject._id} value={subject._id}>
                    {subject.name} (Sem {subject.semester})
                  </option>
                ))}
              </select>
            </div>

            {/* File Extension Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-300">
                File Extension *
              </label>
              <select
                name="extension"
                required
                value={formData.extension}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-700/50 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none transition-all duration-200"
              >
                <option value=".py">Python (.py)</option>
                <option value=".cpp">C++ (.cpp)</option>
                <option value=".java">Java (.java)</option>
                <option value=".js">JavaScript (.js)</option>
                <option value=".c">C (.c)</option>
                <option value=".txt">Plain Text (.txt)</option>
                <option value=".asm">Assembly (.asm)</option>
              </select>
            </div>
          </div>

          {/* Title Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300 flex items-center">
              <FiFileText className="mr-2 text-blue-400" /> Practical Title *
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700/50 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Practical title or assignment name"
            />
          </div>

          {/* Description Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Description *
            </label>
            <textarea
              name="description"
              required
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-700/50 text-white border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
              placeholder="Brief description of your submission..."
            />
          </div>

          {/* Code Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">
              Code *
            </label>
            <div className="relative group">
              <textarea
                name="code"
                required
                rows="10"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-4 py-3 font-mono text-sm bg-gray-900/70 text-gray-200 border border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                placeholder="Paste your code here..."
              />
              <div className="absolute bottom-3 right-3 text-xs text-gray-400 bg-gray-800/90 px-2 py-1 rounded border border-gray-700">
                {formData.extension}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center space-x-2 ${
                isSubmitting
                  ? 'bg-indigo-700 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30'
              } transition-all duration-200`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <FiSend className="text-lg" />
                  <span>Submit Practical</span>
                </>
              )}
            </button>
          </div>
        </form>
      </main>

     
    </div>
  );
};

export default StudentSubmitForm;