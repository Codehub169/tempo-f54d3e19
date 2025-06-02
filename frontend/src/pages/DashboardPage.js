import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircleIcon, DocumentTextIcon, FolderIcon, TagIcon } from '@heroicons/react/24/outline';

function DashboardPage() {
  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-neutral-darkGray font-poppins">Dashboard</h1>
        <p className="text-neutral-mediumGray mt-2">Welcome to your personal blog dashboard. Manage your content with ease.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link 
          to="/create-post"
          className="bg-primary-main hover:bg-primary-light text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center transition-colors duration-300"
        >
          <PlusCircleIcon className="h-12 w-12 mb-3" />
          <h2 className="text-xl font-semibold font-poppins">Create New Post</h2>
          <p className="text-sm text-center mt-1">Start writing your next masterpiece.</p>
        </Link>

        <Link 
          to="/manage-posts"
          className="bg-white hover:bg-neutral-lightGray text-neutral-darkGray p-6 rounded-lg shadow-md flex flex-col items-center justify-center transition-colors duration-300 border border-neutral-mediumGray/30"
        >
          <DocumentTextIcon className="h-12 w-12 mb-3 text-secondary-main" />
          <h2 className="text-xl font-semibold font-poppins">Manage Posts</h2>
          <p className="text-sm text-center mt-1">View, edit, or delete your existing posts.</p>
        </Link>

        <Link 
          to="/manage-categories"
          className="bg-white hover:bg-neutral-lightGray text-neutral-darkGray p-6 rounded-lg shadow-md flex flex-col items-center justify-center transition-colors duration-300 border border-neutral-mediumGray/30"
        >
          <FolderIcon className="h-12 w-12 mb-3 text-secondary-main" />
          <h2 className="text-xl font-semibold font-poppins">Manage Categories</h2>
          <p className="text-sm text-center mt-1">Organize your posts with categories.</p>
        </Link>

        <Link 
          to="/manage-tags"
          className="bg-white hover:bg-neutral-lightGray text-neutral-darkGray p-6 rounded-lg shadow-md flex flex-col items-center justify-center transition-colors duration-300 border border-neutral-mediumGray/30"
        >
          <TagIcon className="h-12 w-12 mb-3 text-secondary-main" />
          <h2 className="text-xl font-semibold font-poppins">Manage Tags</h2>
          <p className="text-sm text-center mt-1">Add descriptive tags to your content.</p>
        </Link>
      </section>

      {/* Placeholder for recent activity or stats */}
      <section className="mt-12 bg-white p-6 rounded-lg shadow-md border border-neutral-mediumGray/30">
        <h3 className="text-2xl font-semibold text-neutral-darkGray font-poppins mb-4">Recent Activity</h3>
        <p className="text-neutral-mediumGray">Your latest drafts and published posts will appear here. (Coming soon)</p>
        {/* Example items - replace with dynamic data later */}
        <ul className="mt-4 space-y-3">
          <li className="p-3 bg-neutral-lightGray rounded-md text-sm">Draft: "My First Thoughts on X" - Saved 2 hours ago</li>
          <li className="p-3 bg-neutral-lightGray rounded-md text-sm">Published: "A Guide to Y" - Published yesterday</li>
        </ul>
      </section>

    </div>
  );
}

export default DashboardPage;
