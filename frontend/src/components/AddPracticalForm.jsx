import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const AddPracticalForm = () => {
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    code: '',
    subject: '',
    extension: '',
  });

  const [status, setStatus] = useState({ loading: false });

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        setStatus({ loading: true });
        const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/subjects`);
        setSubjects(res.data);
      } catch (error) {
        toast.error('Failed to fetch subjects');
      } finally {
        setStatus({ loading: false });
      }
    };
    fetchSubjects();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true });

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/practicals`, formData);
      toast.success('Practical added successfully!');
      setFormData({
        title: '',
        description: '',
        code: '',
        subject: '',
        extension: '',
      });
    } catch (error) {
      toast.error('Failed to add practical.');
    } finally {
      setStatus({ loading: false });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen p-6">
      <Toaster position="top-right" reverseOrder={false} />
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center mb-6">
          <div className="p-2 rounded-lg bg-blue-900 text-blue-300 mr-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">Add New Practical</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
            <input
              type="text"
              name="title"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
            <textarea
              name="description"
              rows="3"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100"
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Code</label>
            <textarea
              name="code"
              rows="8"
              className="w-full px-3 py-2 font-mono text-sm bg-gray-800 border border-gray-700 rounded-md text-gray-100"
              value={formData.code}
              onChange={handleChange}
              placeholder={`# Write your code here\nprint("Hello, World!")`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Subject</label>
            <select
              name="subject"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100"
              value={formData.subject}
              onChange={handleChange}
              required
              disabled={status.loading}
            >
              <option value="">Select Subject</option>
              {subjects.map((subj) => (
                <option key={subj._id} value={subj._id}>
                  {subj.name} ({subj.semester})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">File Extension</label>
            <input
              type="text"
              name="extension"
              placeholder=".py"
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-gray-100"
              value={formData.extension}
              onChange={handleChange}
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full flex justify-center py-2 px-4 rounded-md text-sm font-medium text-white ${
              status.loading ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
            }`}
            disabled={status.loading}
          >
            {status.loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Processing...
              </>
            ) : (
              'Add Practical'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPracticalForm;
