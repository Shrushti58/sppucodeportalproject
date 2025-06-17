import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import FeaturesGrid from '../components/FeaturesGrid';
import { FiBookOpen } from 'react-icons/fi';
import { motion } from 'framer-motion';
import HowItWorksSection from '../components/HowItWorksSection';
import { Element } from 'react-scroll/modules';
import Footer from '../components/Footer';
import SubjectsBySemester from '../components/SubjectsBySemester';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


const LandingPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/subjects`);
        setSubjects(res.data);
      } catch (err) {
        console.error('Failed to fetch subjects:', err.message);
        setError('Failed to load subjects.');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const groupedBySemester = subjects.reduce((acc, subj) => {
    const sem = subj.semester;
    if (!acc[sem]) acc[sem] = [];
    acc[sem].push(subj);
    return acc;
  }, {});

  if (loading) {
    return <div className="min-h-screen flex justify-center items-center text-white text-lg">Loading...</div>;
  }

  if (error) {
    return <div className="min-h-screen flex justify-center items-center text-red-400 text-lg">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-gray-100">
      <Navbar className="backdrop-blur-md bg-gray-900/80 border-b border-gray-800" />
      <HeroSection className="bg-gradient-to-br from-gray-900/90 to-gray-800/90" />
      <FeaturesGrid className="bg-gray-900/50" />
     <Element name="how-it-works">
  <HowItWorksSection />
</Element>


<SubjectsBySemester/>
    <Footer/>

    </div>
  );
};

export default LandingPage;
