import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { HomeIcon, DocumentTextIcon, FolderIcon, TagIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { useState } from 'react';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }) => 
    `flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out 
    ${isActive ? 'bg-primary-blue text-white' : 'text-neutral-darkGray hover:bg-neutral-mediumGray hover:text-neutral-darkGray'}`;

  const mobileNavLinkClass = ({ isActive }) => 
    `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-150 ease-in-out 
    ${isActive ? 'bg-primary-blue text-white' : 'text-neutral-darkGray hover:bg-neutral-mediumGray hover:text-neutral-darkGray'}`;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              {/* You can replace this with an SVG logo or an <img> tag */}
              <span className="text-2xl font-bold text-primary-blue font-poppins">MyBlog</span>
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <NavLink to="/" className={navLinkClass} end>
                <HomeIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Dashboard
              </NavLink>
              <NavLink to="/manage-posts" className={navLinkClass}>
                <DocumentTextIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Posts
              </NavLink>
              <NavLink to="/manage-categories" className={navLinkClass}>
                <FolderIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Categories
              </NavLink>
              <NavLink to="/manage-tags" className={navLinkClass}>
                <TagIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                Tags
              </NavLink>
            </div>
          </div>
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="bg-white inline-flex items-center justify-center p-2 rounded-md text-neutral-darkGray hover:text-primary-blue hover:bg-neutral-lightGray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-neutral-lightGray focus:ring-primary-blue"
              aria-controls="mobile-menu"
              aria-expanded={isMobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state. */}
      {isMobileMenuOpen && (
        <div className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <NavLink to="/" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)} end>
              <HomeIcon className="h-5 w-5 mr-2 inline-block align-text-bottom" aria-hidden="true" />
              Dashboard
            </NavLink>
            <NavLink to="/manage-posts" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              <DocumentTextIcon className="h-5 w-5 mr-2 inline-block align-text-bottom" aria-hidden="true" />
              Posts
            </NavLink>
            <NavLink to="/manage-categories" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              <FolderIcon className="h-5 w-5 mr-2 inline-block align-text-bottom" aria-hidden="true" />
              Categories
            </NavLink>
            <NavLink to="/manage-tags" className={mobileNavLinkClass} onClick={() => setIsMobileMenuOpen(false)}>
              <TagIcon className="h-5 w-5 mr-2 inline-block align-text-bottom" aria-hidden="true" />
              Tags
            </NavLink>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
