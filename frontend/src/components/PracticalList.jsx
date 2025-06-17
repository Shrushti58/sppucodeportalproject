import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

const PracticalList = () => {
  const [practicals, setPracticals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPracticalId, setSelectedPracticalId] = useState(null);

  const API_BASE = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchPracticals();
  }, []);

  const fetchPracticals = async () => {
    try {
      const res = await axios.get(`${API_BASE}/practicals`);
      setPracticals(res.data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch practicals.');
    } finally {
      setLoading(false);
    }
  };

  const deletePractical = async (id) => {
    try {
      await axios.delete(`${API_BASE}/practicals/${id}`);
      toast.success('Practical deleted successfully.');
      fetchPracticals();
    } catch (err) {
      console.error(err);
      toast.error('Failed to delete practical.');
    }
  };

  const uniqueSubjects = [...new Set(
    practicals.map(p => p.subject?.name).filter(Boolean)
  )].sort();

  const filteredPracticals = practicals.filter(pr => {
    const matchesSearch = pr.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pr.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || pr.subject?.name === filterSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-white">Practical List</h2>
      </div>

      <div className="bg-gray-800 rounded-xl shadow-md p-6 mb-8 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search practicals..."
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
              Filter by Subject
            </label>
            <select
              id="subject"
              className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-700 text-white"
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
            >
              <option value="">All Subjects</option>
              {uniqueSubjects.map(subject => (
                <option key={subject} value={subject}>{subject}</option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterSubject('');
              }}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredPracticals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {practicals.length === 0 ? 'No practicals found.' : 'No practicals match your filters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPracticals.map((pr) => (
              <div key={pr._id} className="border border-gray-700 rounded-lg p-6 bg-gray-800">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-semibold text-white">{pr.title}</h3>
                    {pr.subject && (
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-900 text-indigo-200">
                          {pr.subject.name}
                        </span>
                        <span className="text-sm text-gray-400">
                          Semester {pr.subject.semester}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <Link
                      to={`/admin/practicals/edit/${pr._id}`}
                      className="px-3 py-1 text-sm rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => {
                        setSelectedPracticalId(pr._id);
                        setShowModal(true);
                      }}
                      className="px-3 py-1 text-sm rounded-md text-white bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {pr.description && <p className="mt-3 text-gray-300">{pr.description}</p>}

                {pr.code && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm text-gray-400">Code Snippet</span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(pr.code);
                          toast.success('Code copied!');
                        }}
                        className="text-xs text-indigo-400 hover:text-indigo-300"
                      >
                        Copy
                      </button>
                    </div>
                    <pre className="bg-gray-900 p-3 rounded-md overflow-x-auto text-sm text-gray-200 border border-gray-700">
                      <code>{pr.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-600 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete this practical?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  await deletePractical(selectedPracticalId);
                  setShowModal(false);
                  setSelectedPracticalId(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticalList;