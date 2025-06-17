import React, { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const AddSubjectForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    semester: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/subjects`,
        {
          ...formData,
          semester: formData.semester.toUpperCase(),
        }
      );

      if (res.status === 200 || res.status === 201) {
        toast.success("Subject added successfully!");
        setFormData({ name: "", code: "", semester: "" });
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add subject.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
      <Toaster position="top-right" reverseOrder={false} />

      <div className="flex items-center mb-6">
        <div className="p-2 rounded-lg bg-blue-900 text-blue-300 mr-3">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-white">Add New Subject</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Subject Name</label>
          <input
            type="text"
            name="name"
            className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="e.g., Data Structures and Algorithms"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Subject Code</label>
          <input
            type="text"
            name="code"
            className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400"
            value={formData.code}
            onChange={handleChange}
            required
            placeholder="e.g., CS301"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Semester</label>
          <div className="relative">
            <input
              type="text"
              name="semester"
              className="w-full px-3 py-2 bg-gray-700 text-gray-100 border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 uppercase placeholder-gray-400"
              value={formData.semester}
              onChange={handleChange}
              required
              placeholder="SEM3"
              pattern="SEM[1-8]"
              title="Format: SEM1 to SEM8"
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-500">
              {formData.semester ? "" : "SEM_"}
            </div>
          </div>
          <p className="mt-1 text-xs text-gray-400">Format: SEM1 to SEM8</p>
        </div>

        <button
          type="submit"
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${loading ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
          disabled={loading}
        >
          {loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </>
          ) : (
            "Add Subject"
          )}
        </button>
      </form>
    </div>
  );
};

export default AddSubjectForm;
