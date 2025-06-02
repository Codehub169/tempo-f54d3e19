import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CreatePostPage from './pages/CreatePostPage';
import EditPostPage from './pages/EditPostPage';
import ManagePostsPage from './pages/ManagePostsPage';
import ManageCategoriesPage from './pages/ManageCategoriesPage';
import ManageTagsPage from './pages/ManageTagsPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-neutral-lightGray text-neutral-darkGray">
        <Navbar />
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/edit-post/:postId" element={<EditPostPage />} />
            <Route path="/manage-posts" element={<ManagePostsPage />} />
            <Route path="/manage-categories" element={<ManageCategoriesPage />} />
            <Route path="/manage-tags" element={<ManageTagsPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function NotFound() {
  return (
    <div className="text-center py-10">
      <h1 className="text-3xl font-bold text-primary-blue">404 - Page Not Found</h1>
      <p className="mt-4">The page you are looking for does not exist.</p>
      <Link to="/" className="mt-6 inline-block px-6 py-2 text-sm font-medium leading-6 text-center text-white uppercase transition bg-primary-blue rounded shadow ripple hover:shadow-lg hover:bg-secondary-lightBlue focus:outline-none">
        Go to Dashboard
      </Link>
    </div>
  );
}

export default App;
