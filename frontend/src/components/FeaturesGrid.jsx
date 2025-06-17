import { FiCode, FiSearch, FiUpload, FiBook } from 'react-icons/fi';
import { motion } from 'framer-motion';

const FeaturesGrid = () => {
  const features = [
    {
      icon: <FiCode className="text-3xl text-blue-400" />,
      title: "Curated Codes",
      description: "Every practical is reviewed and aligned with the SPPU syllabus.",
    },
    {
      icon: <FiSearch className="text-3xl text-purple-400" />,
      title: "Smart Search",
      description: "Easily filter by subject, branch, semester, or language.",
    },
    {
      icon: <FiUpload className="text-3xl text-blue-400" />,
      title: "Easy Contribution",
      description: "Submit your code with GitHub sync and help others learn.",
    },
    {
      icon: <FiBook className="text-3xl text-purple-400" />,
      title: "In-Depth Docs",
      description: "Get clear explanations and helpful code comments.",
    },
  ];

  return (
    <section id="features" className="py-20 px-4  text-white">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <motion.h2
          className="text-4xl font-bold mb-4 text-purple-400"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          💡 Why Choose SPPU Code Portal?
        </motion.h2>
        <motion.p
          className="text-lg text-gray-300"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          The ultimate toolkit for Computer Engineering students preparing for practicals!
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.2 }}
            className="bg-gray-900 p-6 rounded-xl shadow-lg hover:bg-purple-900 transition duration-300"
          >
            <div className="flex items-center justify-center w-14 h-14 mb-4 mx-auto bg-purple-500/10 rounded-full">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-center text-purple-300 mb-2">{feature.title}</h3>
            <p className="text-gray-300 text-center">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesGrid;
