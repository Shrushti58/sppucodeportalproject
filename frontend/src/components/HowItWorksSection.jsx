import { motion } from 'framer-motion';

const HowItWorksSection = () => {
  return (
    <div id="how-it-works" className="py-16 px-4 sm:px-8 md:px-16 lg:px-32 text-white ">
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: false, amount: 0.3 }}
        className="text-3xl font-bold text-center text-purple-400 mb-12"
      >
        🚀 How SPPU Code Portal Works?
      </motion.h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            title: '📤 Submit Your Code',
            description:
              'Students submit practicals by providing their name, email, subject, and code using a simple form.',
            delay: 0,
          },
          {
            title: '🔍 Admin Reviews It',
            description:
              'Our admin carefully checks every submission for correctness, clarity, and usefulness to peers.',
            delay: 0.2,
          },
          {
            title: '✅ Approved & Published',
            description:
              'Once approved, your code is published on GitHub and added to the portal for others to explore and learn!',
            delay: 0.4,
          },
        ].map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: step.delay }}
            viewport={{ once: false, amount: 0.3 }}
            className="p-6 rounded-xl shadow-lg bg-gray-800 hover:bg-purple-800 transition duration-300"
          >
            <h3 className="text-xl font-semibold mb-2 text-purple-300">{step.title}</h3>
            <p className="text-gray-300">{step.description}</p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        viewport={{ once: false, amount: 0.3 }}
        className="text-center mt-12"
      >
        <p className="text-md text-gray-400">
          Together, we’re building a community of coders who learn, share, and grow. 💡
        </p>
      </motion.div>
    </div>
  );
};

export default HowItWorksSection;
