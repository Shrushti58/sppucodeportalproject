import { useState } from 'react';
import { FiMenu, FiX, FiGithub } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const ScrollNavLink = ({ to, children }) => (
    <ScrollLink
      to={to}
      smooth={true}
      duration={500}
      offset={-80}
      className="cursor-pointer text-white hover:text-purple-400 transition"
      onClick={() => setMobileOpen(false)}
    >
      {children}
    </ScrollLink>
  );

  const RouterNavLink = ({ to, children }) => (
    <RouterLink
      to={to}
      className="cursor-pointer text-white hover:text-purple-400 transition"
      onClick={() => setMobileOpen(false)}
    >
      {children}
    </RouterLink>
  );

  return (
    <nav className="backdrop-blur-lg bg-white/5 border-b border-white/10 fixed w-full z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <RouterLink to="/" className="flex items-center text-xl font-bold">
          <FiGithub className="mr-2 text-blue-400" />
          <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            SPPU CodePortal
          </span>
        </RouterLink>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center space-x-6">
          <ScrollNavLink to="subjects">Subjects</ScrollNavLink>
          <ScrollNavLink to="features">Features</ScrollNavLink>
          <RouterNavLink to="/contribute">Contribute</RouterNavLink>
          <RouterLink to="/admin-login">
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors">
              Admin Login
            </button>
          </RouterLink>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-2xl text-white" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Menu (without search bar) */}
      {mobileOpen && (
        <div className="md:hidden bg-gray-900/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-3 flex flex-col space-y-4">
            <ScrollNavLink to="subjects">Subjects</ScrollNavLink>
            <ScrollNavLink to="features">Features</ScrollNavLink>
            <RouterNavLink to="/contribute">Contribute</RouterNavLink>
            <RouterLink to="/admin-login" className="w-full">
              <button className="bg-blue-600 hover:bg-blue-700 w-full py-3 rounded-lg transition-colors">
                Admin Login
              </button>
            </RouterLink>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
