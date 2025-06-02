import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getPosts, deletePost } from '../services/api'; // Assuming api.js exports these
import { PencilIcon, TrashIcon, PlusCircleIcon } from '@heroicons/react/24/outline';

function ManagePostsPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPosts();
      setPosts(data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setError('Failed to load posts. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await deletePost(postId);
        setPosts(posts.filter(post => post.id !== postId)); // Refresh list
      } catch (err) {
        console.error('Failed to delete post:', err);
        setError('Failed to delete post. Please try again.');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-neutral-darkGray">Loading posts...</div>;
  if (error) return <div className="p-8 text-center text-error">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-neutral-darkGray font-poppins">Manage Posts</h1>
        <Link 
          to="/create-post" 
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          <PlusCircleIcon className="h-5 w-5 mr-2" />
          Create New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-10 bg-white shadow-md rounded-lg">
          <svg className="mx-auto h-12 w-12 text-neutral-mediumGray" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path vectorEffect="non-scaling-stroke" strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-neutral-darkGray">No posts yet</h3>
          <p className="mt-1 text-sm text-neutral-darkGray">Get started by creating a new blog post.</p>
          <div className="mt-6">
            <Link 
              to="/create-post" 
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              <PlusCircleIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
              New Post
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <ul className="divide-y divide-neutral-lightGray">
            {posts.map(post => (
              <li key={post.id} className="p-4 hover:bg-neutral-lightGray transition ease-in-out duration-150">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-primary hover:underline">
                      <Link to={`/edit-post/${post.id}`}>{post.title}</Link>
                    </h2>
                    <p className="text-sm text-neutral-darkGray">
                      Status: <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.status === 'published' ? 'bg-success text-white' : 'bg-warning text-neutral-darkGray'}`}>{post.status}</span>
                    </p>
                    <p className="text-sm text-neutral-darkGray">Last updated: {new Date(post.updated_at || post.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => navigate(`/edit-post/${post.id}`)} 
                      className="p-2 text-secondary hover:text-primary focus:outline-none"
                      title="Edit Post"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeletePost(post.id)} 
                      className="p-2 text-error-dark hover:text-error focus:outline-none"
                      title="Delete Post"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default ManagePostsPage;
