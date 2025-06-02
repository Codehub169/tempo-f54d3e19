import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPost, updatePost, getCategories, getTags } from '../services/api'; // Corrected: getPost instead of getPostById
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

function EditPostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  
  const [allCategories, setAllCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState('');

  const fetchPostData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const postData = await getPost(postId); // Corrected: getPost call
      setTitle(postData.title || '');
      setContent(postData.content || '');
      setStatus(postData.status || 'draft');
      setSelectedCategories((postData.categories || []).map(cat => cat.id)); 
      setSelectedTags((postData.tags || []).map(tag => tag.id));

      const categoriesResponse = await getCategories();
      setAllCategories(categoriesResponse?.data || []); // Corrected: access .data property and ensure array

      const tagsResponse = await getTags();
      setAllTags(tagsResponse?.data || []); // Corrected: access .data property and ensure array

    } catch (err) {
      console.error('Failed to fetch post data:', err);
      setError(`Failed to load post data: ${err.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  }, [postId]);

  useEffect(() => {
    fetchPostData();
  }, [fetchPostData]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId) 
        : [...prev, categoryId]
    );
  };

  const handleTagChange = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId) 
        : [...prev, tagId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!title.trim()) {
      setFormError('Title is required.');
      return;
    }
    
    const postPayload = {
      title,
      content,
      status,
      categoryIds: selectedCategories, // Corrected: to match backend controller (categoryIds)
      tagIds: selectedTags,           // Corrected: to match backend controller (tagIds)
    };

    setLoading(true);
    try {
      await updatePost(postId, postPayload);
      navigate(`/manage-posts`);
    } catch (err) {
      console.error('Failed to update post:', err);
      const apiErrorMessage = err.response?.data?.message || err.message;
      setFormError(`Failed to update post: ${apiErrorMessage || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !title) return <div className="p-8 text-center text-neutral-darkGray">Loading post editor...</div>;
  if (error) return <div className="p-8 text-center text-status-error">Error: {error}</div>; // Corrected: text-status-error

  return (
    <div className="container mx-auto p-4 md:p-8 bg-white shadow-lg rounded-lg">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue transition-colors"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" aria-hidden="true" />
        Back
      </button>
      <h1 className="text-3xl font-bold mb-6 text-neutral-darkGray font-poppins">Edit Post</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-darkGray">Title</label>
          <input 
            type="text" 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-neutral-mediumGray rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-neutral-darkGray">Content</label>
          <textarea 
            id="content" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            rows="10" 
            className="mt-1 block w-full px-3 py-2 border border-neutral-mediumGray rounded-md shadow-sm focus:outline-none focus:ring-primary-blue focus:border-primary-blue sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-neutral-darkGray">Status</label>
          <select 
            id="status" 
            value={status} 
            onChange={(e) => setStatus(e.target.value)} 
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-mediumGray focus:outline-none focus:ring-primary-blue focus:border-primary-blue sm:text-sm rounded-md"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Categories Selection */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-neutral-darkGray">Categories</h3>
          {allCategories.length > 0 ? allCategories.map(category => (
            <div key={category.id} className="flex items-center">
              <input 
                type="checkbox" 
                id={`category-${category.id}`} 
                checked={selectedCategories.includes(category.id)} 
                onChange={() => handleCategoryChange(category.id)} 
                className="h-4 w-4 text-primary-blue border-neutral-mediumGray rounded focus:ring-primary-blue"
              />
              <label htmlFor={`category-${category.id}`} className="ml-2 block text-sm text-neutral-darkGray">
                {category.name}
              </label>
            </div>
          )) : <p className="text-sm text-neutral-darkGray">No categories available. You can create them in the 'Manage Categories' section.</p>}
        </div>

        {/* Tags Selection */}
        <div className="space-y-2">
          <h3 className="text-lg font-medium text-neutral-darkGray">Tags</h3>
          {allTags.length > 0 ? allTags.map(tag => (
            <div key={tag.id} className="flex items-center">
              <input 
                type="checkbox" 
                id={`tag-${tag.id}`} 
                checked={selectedTags.includes(tag.id)} 
                onChange={() => handleTagChange(tag.id)} 
                className="h-4 w-4 text-primary-blue border-neutral-mediumGray rounded focus:ring-primary-blue"
              />
              <label htmlFor={`tag-${tag.id}`} className="ml-2 block text-sm text-neutral-darkGray">
                {tag.name}
              </label>
            </div>
          )) : <p className="text-sm text-neutral-darkGray">No tags available. You can create them in the 'Manage Tags' section.</p>}
        </div>

        {formError && <p className="text-sm text-status-error">{formError}</p>} {/* Corrected: text-status-error */}
        
        <div className="flex justify-end space-x-3 pt-4 border-t border-neutral-lightGray">
            <button 
                type="button" 
                onClick={() => navigate('/manage-posts')} 
                className="px-4 py-2 border border-neutral-mediumGray text-sm font-medium rounded-md text-neutral-darkGray bg-white hover:bg-neutral-lightGray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue transition-colors"
                disabled={loading}
            >
                Cancel
            </button>
            <button 
                type="submit" 
                disabled={loading} 
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-blue hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-blue disabled:opacity-50 transition-colors"
            >
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </form>
    </div>
  );
}

export default EditPostPage;
