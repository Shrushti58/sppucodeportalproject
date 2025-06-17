import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { FiBookOpen } from "react-icons/fi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { Element } from 'react-scroll/modules';

// Animation variants
const containerVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.15 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 60,
      damping: 12,
    },
  },
  exit: { opacity: 0, y: 30 },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -10 },
};

const headingVariants = {
  hidden: { opacity: 0, y: -10 },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12 },
  }),
};

const floatAnimation = {
  animate: {
    y: [0, -8, 0],
  },
  transition: {
    duration: 3,
    ease: "easeInOut",
    repeat: Infinity,
  },
};

const SubjectsBySemester = () => {
  const [subjects, setSubjects] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/subjects`)
      .then((res) => {
        setSubjects(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching subjects:", err);
        setLoading(false);
      });
  }, []);

  const groupedBySemester = subjects.reduce((acc, subject) => {
    const semester = subject.semester || "Unknown";
    if (!acc[semester]) acc[semester] = [];
    acc[semester].push(subject);
    return acc;
  }, {});

  const filteredSubjects = Object.entries(groupedBySemester).map(
    ([semester, semSubjects]) => {
      const filtered = semSubjects.filter((subject) =>
        subject.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return [semester, filtered];
    }
  );

  return (
    <Element name="subjects">
<section id="subjects" className="container mx-auto px-6 py-20">
      {/* Animated Heading */}
      <div className="text-4xl md:text-5xl font-bold text-center mb-10 text-white flex flex-wrap justify-center">
        {"Subjects by Semester".split(" ").map((word, i) => (
          <motion.span
            key={i}
            custom={i}
            variants={headingVariants}
            initial="hidden"
            animate="show"
            className="mr-2 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent"
          >
            {word}
          </motion.span>
        ))}
      </div>

      {/* Search Input */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="max-w-xl mx-auto mb-12"
      >
        <input
          type="text"
          placeholder="Search subject..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-5 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </motion.div>

      {/* Loading Spinner */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <AiOutlineLoading3Quarters className="animate-spin text-white text-4xl" />
        </div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: false, amount: 0.1 }}
        >
          <AnimatePresence>
            {filteredSubjects.map(([semester, semSubjects]) =>
              semSubjects.length > 0 ? (
                <motion.div
                  key={semester}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: false, amount: 0.2 }}
                  exit="exit"
                  {...floatAnimation}
                  className="rounded-2xl p-6 bg-gradient-to-br from-indigo-900/80 to-indigo-600/80 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 backdrop-blur-sm"
                >
                  <h3 className="text-xl font-semibold text-white mb-4 tracking-wide border-b border-white/20 pb-2">
                    Semester {semester}
                  </h3>

                  <ul className="space-y-3">
                    <AnimatePresence>
                      {semSubjects.map((subject) => (
                        <motion.li
                          key={subject._id}
                          variants={itemVariants}
                          initial="hidden"
                          whileInView="show"
                          viewport={{ once: false, amount: 0.2 }}
                          exit="exit"
                          className="flex items-start group transition-all duration-200"
                        >
                          <FiBookOpen className="text-emerald-300 mt-1 mr-2" />
                          <Link
                            to={`/subjects/${subject._id}`}
                            className="text-white font-medium transition-colors duration-300 group-hover:text-yellow-300 hover:underline"
                          >
                            {subject.name}
                          </Link>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </motion.div>
              ) : null
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
    </Element>
  );
};

export default SubjectsBySemester;
