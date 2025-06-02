import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import PostForm from '../components/PostForm'; // Will be created in a future batch
// import { createPost, getAllCategories, getAllTags } from '../services/api'; // Will be created/used in a future batch

function CreatePostPage() {
  const navigate = useNavigate();
  // const [categories, setCategories] = useState([]); // For PostForm props
  // const [tags, setTags] = useState([]); // For PostForm props
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // For loading state

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const [categoriesData, tagsData] = await Promise.all([
  //         getAllCategories(),
  //         getAllTags(),
  //       ]);
  //       setCategories(categoriesData || []);
  //       setTags(tagsData || []);
  //     } catch (err) {
  //       setError('Failed to load categories or tags.');
  //       console.error(err);
  //     }
  //   };
  //   fetchData();
  // }, []);

  const handleSubmit = async (postData) => {
    setIsLoading(true);
    setError('');
    console.log('Submitting post data (CreatePostPage):', postData); // Placeholder
    // try {
    //   await createPost(postData);
    //   navigate('/manage-posts'); // Or to the new post's page
    // } catch (err) {
    //   setError('Failed to create post. Please try again.');
    //   console.error(err);
    // } finally {
    //   setIsLoading(false);
    // }
    // Mock submission for now
    setTimeout(() => {
        alert('Post creation simulated. API call would be here.');
        navigate('/manage-posts');
        setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="container mx-auto p-6">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-darkGray font-poppins">Create New Post</h1>
        <p className="text-neutral-mediumGray mt-1">Craft your content and share your voice.</p>
      </header>
      
      {error && <div className="bg-error-main/10 border border-error-main text-error-dark p-3 rounded-md mb-4">{error}</div>}

      {/* Placeholder for PostForm component */}
      <div className="bg-white p-8 rounded-lg shadow-md border border-neutral-mediumGray/30">
        <p className="text-neutral-darkGray mb-4">The <code>PostForm</code> component will be rendered here once created. For now, this is a placeholder.</p>
        <form onSubmit={(e) => { 
            e.preventDefault(); 
            const formData = new FormData(e.target);
            const data = {
                title: formData.get('title'),
                content: formData.get('content'),
                status: formData.get('status'),
                category_ids: [], // Placeholder
                tag_ids: [] // Placeholder
            };
            handleSubmit(data); 
        }}>
            <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-neutral-darkGray mb-1">Title</label>
                <input type="text" name="title" id="title" required className="w-full px-3 py-2 border border-neutral-mediumGray rounded-md shadow-sm focus:ring-primary-main focus:border-primary-main" />
            </div>
            <div className="mb-4">
                <label htmlFor="content" className="block text-sm font-medium text-neutral-darkGray mb-1">Content</label>
                <textarea name="content" id="content" rows="10" required className="w-full px-3 py-2 border border-neutral-mediumGray rounded-md shadow-sm focus:ring-primary-main focus:border-primary-main"></textarea>
            </div>
             <div className="mb-6">
              <label htmlFor="status" className="block text-sm font-medium text-neutral-darkGray mb-1">Status</label>
              <select 
                name="status" 
                id="status" 
                defaultValue="draft"
                className="w-full px-3 py-2 border border-neutral-mediumGray rounded-md shadow-sm focus:ring-primary-main focus:border-primary-main"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
                 <button 
                    type="button" 
                    onClick={() => navigate(-1)} 
                    className="px-4 py-2 border border-neutral-mediumGray text-neutral-darkGray rounded-md hover:bg-neutral-lightGray transition-colors"
                    disabled={isLoading}
                >
                    Cancel
                </button>
                <button 
                    type="submit" 
                    className="px-6 py-2 bg-primary-main hover:bg-primary-light text-white font-semibold rounded-md shadow-sm focus:ring-2 focus:ring-offset-2 focus:ring-primary-main transition-colors disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? 'Creating...' : 'Create Post'}
                </button>
            </div>
        </form>
      </div>
      {/* <PostForm 
        onSubmit={handleSubmit} 
        initialData={{ title: '', content: '', status: 'draft', category_ids: [], tag_ids: [] }} 
        categories={categories} 
        tags={tags} 
        isLoading={isLoading}
        submitButtonText="Create Post"
      /> */}
    </div>
  );
}

export default CreatePostPage;