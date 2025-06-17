import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const EditPracticalForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [practical, setPractical] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([fetchPractical(), fetchSubjects()]);
      } catch (error) {
        console.error('Error loading data:', error);
        setMessage({ text: 'Failed to load data', type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const fetchPractical = async () => {
    const res = await axios.get(`${API_BASE_URL}/practicals/${id}`);
    const practicalData = res.data;

    let code = practicalData.code || '';
    if (practicalData.codeLink) {
      const rawLink = practicalData.codeLink
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/');

      try {
        const response = await fetch(rawLink);
        if (response.ok) {
          code = await response.text();
        }
      } catch (error) {
        console.warn('Could not fetch code from GitHub:', error);
      }
    }

    setPractical({ ...practicalData, code });
  };

  const fetchSubjects = async () => {
    const res = await axios.get(`${API_BASE_URL}/subjects`);
    setSubjects(res.data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPractical(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    
    try {
      await axios.put(`${API_BASE_URL}/practicals/${id}`, practical);
      setMessage({ text: 'Practical updated successfully!', type: 'success' });
      setTimeout(() => navigate('/admin-dashboard'), 1500);
    } catch (err) {
      console.error(err);
      setMessage({ text: 'Failed to update practical. Please try again.', type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!practical) {
    return (
      <div className="text-center py-12 bg-gray-900 text-red-400">
        <p>Failed to load practical data.</p>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-gray-900 overflow-y-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
       <div className="sticky top-0 z-50 bg-gray-800 border-b border-gray-700 py-4 px-6 -mx-6 mb-8 flex justify-between items-center backdrop-blur-sm bg-opacity-90">
  <h1 className="text-2xl md:text-3xl font-bold text-white">
    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
      Edit Practical
    </span>
  </h1>
  <button
    onClick={() => navigate('/admin-dashboard')}
    className="group flex items-center space-x-2 px-3 py-2 rounded-md hover:bg-gray-700 transition-colors"
  >
    <svg 
      className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
    </svg>
    <span className="text-gray-300 group-hover:text-white transition-colors hidden sm:inline-block">
      Back to Dashboard
    </span>
  </button>
</div>

        {message && (
          <div className={`mb-6 p-4 rounded-md border-l-4 ${
            message.type === 'success' 
              ? 'bg-green-900 bg-opacity-20 text-green-300 border-green-500' 
              : 'bg-red-900 bg-opacity-20 text-red-300 border-red-500'
          }`}>
            {message.text}
          </div>
        )}

        <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={practical.title}
                  onChange={handleChange}
                  placeholder="Enter practical title"
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={practical.description}
                  onChange={handleChange}
                  placeholder="Enter practical description"
                  rows="4"
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
                  required
                />
              </div>

              <div>
                <label htmlFor="codeLink" className="block text-sm font-medium text-gray-300 mb-1">
                  GitHub Link (read-only)
                </label>
                <input
                  type="text"
                  id="codeLink"
                  value={practical.codeLink || 'Not specified'}
                  readOnly
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md text-gray-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-300 mb-1">
                  Code Content
                </label>
                <div className="relative">
                  <textarea
                    id="code"
                    name="code"
                    value={practical.code}
                    onChange={handleChange}
                    placeholder="Enter your code here"
                    rows="12"
                    className="w-full px-4 py-3 font-mono text-sm bg-gray-900 text-gray-100 border border-gray-700 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  {practical.code && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(practical.code);
                        setMessage({ text: 'Code copied to clipboard!', type: 'success' });
                      }}
                      className="absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded hover:bg-gray-600"
                    >
                      Copy
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                  Subject *
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={practical.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                >
                  <option value="">Select a subject</option>
                  {subjects.map((subj) => (
                    <option key={subj._id} value={subj._id}>
                      {subj.name} (Semester {subj.semester})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
              <button
                type="button"
                onClick={() => navigate('/admin-dashboard')}
                className="px-4 py-2 border border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-300 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating...
                  </>
                ) : 'Update Practical'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditPracticalForm;
