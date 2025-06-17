import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FiArrowLeft, FiSearch } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SubjectPage = () => {
  const { subjectId } = useParams();
  const [allPracticals, setAllPracticals] = useState([]);
  const [filteredPracticals, setFilteredPracticals] = useState([]);
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [practicalsRes, subjectRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/practicals/subject/${subjectId}`),
          axios.get(`${API_BASE_URL}/subjects/${subjectId}`)
        ]);

        setAllPracticals(practicalsRes.data);
        setFilteredPracticals(practicalsRes.data);
        setSubject(subjectRes.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Failed to load subject data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subjectId]);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredPracticals(allPracticals);
    } else {
      const filtered = allPracticals.filter(practical => 
        practical.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (practical.description && practical.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredPracticals(filtered);
    }
  }, [searchTerm, allPracticals]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 bg-gray-900 min-h-screen">
        <div className="bg-red-900 border-l-4 border-red-500 text-red-200 p-4" role="alert">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header with back button on right */}
       <div className="sticky top-0 z-10 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 py-6 -mx-6 px-6 mb-8">
  <div className="flex justify-between items-center max-w-7xl mx-auto">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-white">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
          {subject?.name}
        </span>
        <span className="ml-2 text-gray-400 font-medium">
          (Semester {subject?.semester})
        </span>
      </h1>
    </div>
    <Link 
      to="/" 
      className="group flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg transition-all duration-200 border border-gray-700 hover:border-gray-600"
    >
      <FiArrowLeft className="text-gray-400 group-hover:text-white transition-colors" />
      <span className="text-gray-300 group-hover:text-white transition-colors">
        Back to Subjects
      </span>
    </Link>
  </div>
</div>

        {/* Search Filter */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-700 rounded-md leading-5 bg-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search practicals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredPracticals.length === 0 ? (
          <div className="bg-gray-800 rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-400 text-lg">
              {searchTerm ? 'No matching practicals found.' : 'No practicals available for this subject yet.'}
            </p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')} 
                className="mt-4 text-indigo-400 hover:text-indigo-300"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-2">
                {filteredPracticals.length} Practical{filteredPracticals.length !== 1 ? 's' : ''} {searchTerm ? 'found' : 'available'}
              </h2>
              <p className="text-gray-400">
                {subject?.description || 'Explore the practical assignments for this subject.'}
              </p>
            </div>

            {filteredPracticals.map((practical, index) => (
              <div 
                key={practical._id} 
                className="bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 hover:ring-1 hover:ring-gray-700"
              >
                <div className="p-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-indigo-900 rounded-full w-8 h-8 flex items-center justify-center mr-4 mt-1">
                      <span className="text-indigo-200 font-medium text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold mb-2">
                        {practical.title}
                      </h3>
                      {practical.description && (
                        <p className="text-gray-400 mb-4">
                          {practical.description}
                        </p>
                      )}
                      <div className="text-left">
                        <Link
                          to={`/practicals/${practical._id}`}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 transition duration-300"
                        >
                          View Code
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectPage;