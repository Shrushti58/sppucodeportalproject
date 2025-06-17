import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FiArrowLeft, FiCopy, FiExternalLink, 
  FiCode, FiBook, FiCalendar, 
  FiAlertTriangle, FiGitBranch 
} from 'react-icons/fi';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const PracticalDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [practical, setPractical] = useState(null);
  const [subject, setSubject] = useState(null);
  const [codeContent, setCodeContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [codeLoading, setCodeLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [language, setLanguage] = useState('javascript');

  const convertToRawUrl = (githubUrl) => {
    try {
      const url = new URL(githubUrl);
      if (url.hostname === 'github.com') {
        const pathParts = url.pathname.split('/');
        if (pathParts.length >= 5 && pathParts[3] === 'blob') {
          const user = pathParts[1];
          const repo = pathParts[2];
          const branch = pathParts[4];
          const filePath = pathParts.slice(5).join('/');

          const extension = filePath.split('.').pop().toLowerCase();
          switch (extension) {
            case 'js': setLanguage('javascript'); break;
            case 'py': setLanguage('python'); break;
            case 'java': setLanguage('java'); break;
            case 'cpp': case 'cc': case 'cxx': setLanguage('cpp'); break;
            case 'c': setLanguage('c'); break;
            case 'css': setLanguage('css'); break;
            case 'html': case 'htm': setLanguage('markup'); break;
            case 'json': setLanguage('json'); break;
            default: setLanguage('javascript');
          }

          return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${filePath}`;
        }
      }
      return githubUrl;
    } catch {
      return githubUrl;
    }
  };

  const fetchCodeFromGitHub = async (url) => {
    try {
      setCodeLoading(true);
      const rawUrl = convertToRawUrl(url);
      const response = await axios.get(rawUrl);
      setCodeContent(response.data);
    } catch (err) {
      console.error('Error fetching code from GitHub:', err);
      setError('Failed to load code from GitHub. You can view it directly on GitHub instead.');
    } finally {
      setCodeLoading(false);
    }
  };

  useEffect(() => {
    const fetchPractical = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/practicals/${id}`);
        setPractical(res.data);

        if (res.data.subject && typeof res.data.subject === 'object') {
          setSubject(res.data.subject);
        } else if (res.data.subject) {
          const subjectRes = await axios.get(`${API_BASE_URL}/subjects/${res.data.subject}`);
          setSubject(subjectRes.data);
        }

        if (res.data.codeLink) {
          await fetchCodeFromGitHub(res.data.codeLink);
        }
      } catch (err) {
        console.error('Error fetching practical:', err);
        setError('Failed to load practical. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPractical();
  }, [id]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-red-900/50 border-l-4 border-red-500 text-red-200 p-4 rounded-lg shadow-lg">
          <div className="flex items-center">
            <FiAlertTriangle className="mr-2" />
            <p>{error}</p>
          </div>
          <button 
            onClick={() => navigate(-1)}
            className="mt-3 text-sm text-red-300 hover:text-red-100 font-medium flex items-center"
          >
            <FiArrowLeft className="mr-1" /> Back to previous page
          </button>
        </div>
      </div>
    );
  }

  if (!practical) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900 items-center justify-center p-6">
        <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-400">No practical found with this ID.</p>
          <Link 
            to="/practicals" 
            className="text-indigo-400 hover:text-indigo-300 inline-flex items-center mt-4"
          >
            <FiArrowLeft className="mr-1" /> View all practicals
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      {/* Header with navigation */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-indigo-400 hover:text-indigo-300"
          >
            <FiArrowLeft className="mr-2" /> Back to Practicals
          </button>

          {practical.codeLink && (
            <div className="flex items-center space-x-3">
              <button
                onClick={() => copyToClipboard(practical.codeLink)}
                className={`flex items-center px-3 py-1.5 text-sm rounded-md ${
                  copied ? 'bg-green-900/50 text-green-300' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                }`}
              >
                <FiCopy className="mr-1.5" /> {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <a
                href={practical.codeLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <FiExternalLink className="mr-1.5" /> View on GitHub
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Main content area - full screen */}
      <div className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 h-full">
          <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 p-6 sm:p-8 h-full flex flex-col">
            {/* Title and subject info */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-3">{practical.title}</h1>
              {subject && (
                <div className="flex gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-xs bg-indigo-900/50 text-indigo-300 border border-indigo-700">
                    <FiBook className="inline mr-1" /> {subject.name}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs bg-purple-900/50 text-purple-300 border border-purple-700">
                    <FiCalendar className="inline mr-1" /> Semester {subject.semester}
                  </span>
                </div>
              )}
            </div>

            {/* Scrollable content */}
            <div className="flex-1 overflow-auto space-y-6">
              {/* Description section */}
              {practical.description && (
                <div>
                  <h2 className="text-lg font-semibold text-gray-300 mb-2 flex items-center">
                    <FiCode className="mr-2 text-indigo-400" /> Description
                  </h2>
                  <pre className="bg-gray-900 p-4 rounded-lg border border-gray-700 text-gray-400 whitespace-pre-wrap overflow-x-auto">
                    {practical.description}
                  </pre>
                </div>
              )}

              {/* Code section */}
              {practical.codeLink && (
                <div className="flex-1 flex flex-col">
                  <h2 className="text-lg font-semibold text-gray-300 mb-2 flex items-center">
                    <FiCode className="mr-2 text-indigo-400" /> Code
                  </h2>

                  <div className="flex justify-between items-center mb-2">
                    {language && (
                      <span className="px-2 py-1 text-xs bg-gray-700 text-gray-300 rounded">
                        {language}
                      </span>
                    )}
                    <button
                      onClick={() => copyToClipboard(codeContent)}
                      disabled={codeLoading || !codeContent}
                      className={`flex items-center px-3 py-1.5 text-sm rounded-md ${
                        copied ? 'bg-green-900/50 text-green-300' : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                      }`}
                    >
                      <FiCopy className="mr-1" /> {copied ? 'Copied!' : 'Copy Code'}
                    </button>
                  </div>

                  {codeLoading ? (
                    <div className="flex-1 flex items-center justify-center bg-gray-900 rounded-lg border border-gray-700">
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-indigo-500 mr-3"></div>
                        <span className="text-gray-400">Loading code from GitHub...</span>
                      </div>
                    </div>
                  ) : codeContent ? (
                    <div className="flex-1 overflow-hidden rounded-lg border border-gray-700">
                      <SyntaxHighlighter
                        language={language}
                        style={vscDarkPlus}
                        showLineNumbers
                        wrapLines
                        customStyle={{
                          height: '100%',
                          margin: '0',
                          padding: '1rem',
                          fontSize: '0.875rem',
                          backgroundColor: '#111827',
                          overflow: 'auto'
                        }}
                        lineNumberStyle={{ 
                          color: '#6B7280', 
                          borderRight: '1px solid #374151', 
                          paddingRight: '1em',
                          minWidth: '2.5em'
                        }}
                      >
                        {codeContent}
                      </SyntaxHighlighter>
                    </div>
                  ) : (
                    <div className="bg-yellow-900/30 border-l-4 border-yellow-500 text-yellow-300 p-4 rounded-lg">
                      <div className="flex items-center">
                        <FiAlertTriangle className="mr-2" />
                        <p>Could not load code content. Please view it on GitHub instead.</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PracticalDetail;