import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FiCopy, FiCheck, FiThumbsUp, FiThumbsDown, FiX, FiFilter, FiSearch } from 'react-icons/fi';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const rejectionReasons = [
  "The code is incomplete and may need some additional parts.",
  "The logic seems incorrect or might not handle all cases.",
  "The code appears similar to existing solutions. Please try writing in your own way.",
  "The formatting could be improved for better readability.",
  "Looks like this was submitted under the wrong subject.",
  "The explanation is unclear; improving documentation will help others understand."
];

const AdminSubmissionsReview = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentSubmission, setCurrentSubmission] = useState(null);
  const [selectedReason, setSelectedReason] = useState(rejectionReasons[0]);
  const [copiedId, setCopiedId] = useState(null);
  const [processingIds, setProcessingIds] = useState([]); // Track submissions being processed

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/submissions/pending`);
      setSubmissions(res.data);
    } catch (err) {
      setMessage('Failed to fetch submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (submissionId) => {
    try {
      setProcessingIds(prev => [...prev, submissionId]);
      setMessage('Processing approval...');
      
      await axios.post(`${API_BASE_URL}/submissions/${submissionId}/approve`);
      
      setMessage('✅ Submission approved and pushed to GitHub!');
      setTimeout(() => setMessage(''), 3000);
      await fetchSubmissions();
    } catch (err) {
      setMessage('❌ Approval failed. Please try again.');
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== submissionId));
    }
  };

  const handleRejectClick = (submission) => {
    setCurrentSubmission(submission);
    setSelectedReason(rejectionReasons[0]);
    setShowRejectModal(true);
  };

  const confirmRejection = async () => {
    if (!currentSubmission) return;

    try {
      setProcessingIds(prev => [...prev, currentSubmission._id]);
      setMessage('Processing rejection...');
      
      await axios.put(`${API_BASE_URL}/submissions/${currentSubmission._id}/reject`, {
        reason: selectedReason
      });
      
      setMessage('Submission rejected with reason.');
      setTimeout(() => setMessage(''), 3000);
      setShowRejectModal(false);
      await fetchSubmissions();
    } catch (err) {
      setMessage('Rejection failed. Please try again.');
    } finally {
      setProcessingIds(prev => prev.filter(id => id !== currentSubmission._id));
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const uniqueSubjects = [...new Set(
    submissions.map(s => s.subject?.name).filter(Boolean)
  )].sort();

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSubject = !filterSubject || sub.subject?.name === filterSubject;
    return matchesSearch && matchesSubject;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 relative">

      {/* Modal Background Blur */}
      {showRejectModal && (
        <>
          <div
            className="fixed inset-0 bg-transparent backdrop-blur-sm z-40"
            onClick={() => setShowRejectModal(false)}
          ></div>
          <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
            <div
              className="bg-gray-800 rounded-xl p-6 w-full max-w-md border border-gray-700 shadow-2xl transform transition-all duration-300 scale-100"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Reject Submission</h3>
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <FiX size={24} />
                </button>
              </div>

              <p className="text-gray-300 mb-4">Select rejection reason:</p>

              <select
                className="w-full px-4 py-3 mb-6 bg-gray-700 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
              >
                {rejectionReasons.map((reason, idx) => (
                  <option key={idx} value={reason}>{reason}</option>
                ))}
              </select>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                  disabled={processingIds.includes(currentSubmission?._id)}
                >
                  Cancel
                </button>
                <button
                  onClick={confirmRejection}
                  className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg flex items-center transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={processingIds.includes(currentSubmission?._id)}
                >
                  {processingIds.includes(currentSubmission?._id) ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <FiThumbsDown className="mr-2" />
                  )}
                  {processingIds.includes(currentSubmission?._id) ? 'Processing...' : 'Confirm Rejection'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Pending Submissions</h2>
        <p className="text-gray-400">Review and approve or reject code submissions</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('✅') 
          ? 'bg-green-900/30 text-green-300 border-l-4 border-green-500'
          : message.includes('Processing') 
            ? 'bg-blue-900/30 text-blue-300 border-l-4 border-blue-500'
            : 'bg-red-900/30 text-red-300 border-l-4 border-red-500'}`}>
          {message}
        </div>
      )}

      <div className="bg-gray-800/60 rounded-xl shadow-lg p-6 mb-8 border border-gray-700 backdrop-blur-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {/* Search */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search submissions..."
                className="w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-300 mb-1">Filter by Subject</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiFilter className="text-gray-500" />
              </div>
              <select
                className="w-full pl-10 pr-3 py-2.5 bg-gray-700 border border-gray-600 rounded-lg text-white appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                value={filterSubject}
                onChange={(e) => setFilterSubject(e.target.value)}
              >
                <option value="">All Subjects</option>
                {uniqueSubjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Clear Filters */}
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterSubject('');
              }}
              className="w-full px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 flex items-center justify-center"
            >
              <FiX className="mr-2" />
              Clear Filters
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">
              {submissions.length === 0 ? 'No pending submissions.' : 'No submissions match your filters.'}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredSubmissions.map((sub) => (
              <div
                key={sub._id}
                className="border border-gray-700 rounded-xl p-6 bg-gray-800/50 hover:bg-gray-800/70 transition-all duration-200 hover:border-gray-600 shadow-sm"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-white mb-1">{sub.title}</h3>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {sub.subject && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-900/50 text-indigo-200 border border-indigo-800">
                          {sub.subject.name}
                        </span>
                      )}
                      <span className="text-sm text-gray-400">
                        Submitted by: <span className="text-gray-300">{sub.name}</span> ({sub.email})
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button
                      onClick={() => handleRejectClick(sub)}
                      className={`flex items-center justify-center px-4 py-2 ${processingIds.includes(sub._id) ? 'bg-gray-600' : 'bg-red-600/90 hover:bg-red-700'} text-white rounded-lg text-sm transition-colors disabled:opacity-50`}
                      disabled={processingIds.includes(sub._id)}
                    >
                      {processingIds.includes(sub._id) ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <FiThumbsDown className="mr-2" />
                      )}
                      {processingIds.includes(sub._id) ? 'Processing...' : 'Reject'}
                    </button>
                    <button
                      onClick={() => handleApprove(sub._id)}
                      className={`flex items-center justify-center px-4 py-2 ${processingIds.includes(sub._id) ? 'bg-gray-600' : 'bg-green-600/90 hover:bg-green-700'} text-white rounded-lg text-sm transition-colors disabled:opacity-50`}
                      disabled={processingIds.includes(sub._id)}
                    >
                      {processingIds.includes(sub._id) ? (
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <FiThumbsUp className="mr-2" />
                      )}
                      {processingIds.includes(sub._id) ? 'Processing...' : 'Approve'}
                    </button>
                  </div>
                </div>

                {sub.description && (
                  <div className="mt-4 p-3 bg-gray-800/30 rounded-lg border border-gray-700">
                    <p className="text-gray-300">{sub.description}</p>
                  </div>
                )}

                {sub.code && (
                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-400">Submitted Code</span>
                      <button
                        onClick={() => copyToClipboard(sub.code, sub._id)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center"
                      >
                        {copiedId === sub._id ? (
                          <>
                            <FiCheck className="mr-1" /> Copied!
                          </>
                        ) : (
                          <>
                            <FiCopy className="mr-1" /> Copy
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="bg-gray-900/50 p-4 rounded-lg overflow-x-auto text-sm text-gray-200 border border-gray-700">
                      <code>{sub.code}</code>
                    </pre>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminSubmissionsReview;