import React from 'react';
import { FiGithub, FiMail, FiLinkedin, FiHeart, FiTerminal } from 'react-icons/fi';

const Footer = () => {
  const socialLinks = [
    {
      icon: <FiGithub className="text-lg" />,
      url: "https://github.com/Shrushti58/sppucodeportal",
      label: "GitHub"
    },
    {
      icon: <FiLinkedin className="text-lg" />,
      url: "https://www.linkedin.com/in/shrushtipatil58",
      label: "LinkedIn"
    }
  ];

  const contactEmail = "sppucodeportal@gmail.com";
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-400 pt-14 pb-10 border-t border-gray-700/50 relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand Info */}
          <div>
            <div className="flex items-center mb-4">
              <FiGithub className="text-purple-400 text-2xl mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                SPPU CodePortal
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              A curated platform for students to share, explore, and contribute practical codes aligned with the SPPU syllabus.
            </p>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>
            <div className="flex items-center space-x-3 hover:text-blue-400 transition duration-200">
              <FiMail />
              <a
                href={`mailto:${contactEmail}`}
                className="text-sm hover:underline"
              >
                {contactEmail}
              </a>
            </div>
            <div className="flex space-x-4 mt-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-gray-800 hover:bg-blue-600 hover:text-white transition duration-300"
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Spacer or future links */}
          <div className="text-sm text-gray-500 hidden md:block">
            <h3 className="text-lg font-semibold text-white mb-4">Coming Soon</h3>
            <p>More features and branch support will be added soon to serve all SPPU students better.</p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-2">
          <span>© {currentYear} SPPU CodePortal. All rights reserved.</span>
          <span className="flex items-center gap-1">
            Made with <FiHeart className="text-red-400" /> for students & educators
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
