import React, { useEffect, useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({ name: "", code: "", semester: "" });
  const [showModal, setShowModal] = useState(false);
  const [subjectToDelete, setSubjectToDelete] = useState(null);

  const API = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${API}/subjects`);
      setSubjects(res.data);
    } catch (err) {
      console.error("Error fetching subjects", err);
      setError("Failed to load subjects. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (subject) => {
    setSubjectToDelete(subject);
    setShowModal(true);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API}/subjects/${subjectToDelete._id}`);
      toast.success(`"${subjectToDelete.name}" deleted successfully!`);
      fetchSubjects();
    } catch (err) {
      console.error("Error deleting subject", err);
      toast.error("Failed to delete subject. Please try again.");
    } finally {
      setShowModal(false);
      setSubjectToDelete(null);
    }
  };

  const startEditing = (subject) => {
    setEditingId(subject._id);
    setEditData({ 
      name: subject.name, 
      code: subject.code, 
      semester: subject.semester 
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${API}/subjects/${editingId}`, editData);
      toast.success("Subject updated successfully!");
      setEditingId(null);
      fetchSubjects();
    } catch (err) {
      console.error("Error updating subject", err);
      toast.error("Failed to update subject. Please try again.");
    }
  };

  const cancelEditing = () => {
    setEditingId(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 p-4 rounded-lg">
      <Toaster />
      {error && (
        <div className="bg-red-900 bg-opacity-20 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-300">{error}</p>
              <button 
                onClick={fetchSubjects} 
                className="mt-2 inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="shadow overflow-hidden border-b border-gray-700 sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Semester</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-gray-800 divide-y divide-gray-700">
            {subjects.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-400">No subjects found</td>
              </tr>
            ) : (
              subjects.map((sub) => (
                <tr key={sub._id} className="hover:bg-gray-700">
                  {editingId === sub._id ? (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input name="name" value={editData.name} onChange={handleEditChange} className="w-full px-2 py-1 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input name="code" value={editData.code} onChange={handleEditChange} className="w-full px-2 py-1 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input name="semester" value={editData.semester} onChange={handleEditChange} className="w-full px-2 py-1 bg-gray-700 text-gray-100 border border-gray-600 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 uppercase" placeholder="SEM3" />
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={handleUpdate} className="text-green-400 hover:text-green-300">Save</button>
                        <button onClick={cancelEditing} className="text-gray-400 hover:text-gray-300">Cancel</button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 text-sm font-medium text-gray-100">{sub.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{sub.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-300">{sub.semester}</td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button onClick={() => startEditing(sub)} className="text-blue-400 hover:text-blue-300">Edit</button>
                        <button onClick={() => confirmDelete(sub)} className="text-red-400 hover:text-red-300">Delete</button>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && subjectToDelete && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-600 max-w-sm w-full">
            <h3 className="text-lg font-semibold text-white mb-4">Confirm Deletion</h3>
            <p className="text-gray-300 mb-6">Are you sure you want to delete "{subjectToDelete.name}"?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
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

export default SubjectList;
