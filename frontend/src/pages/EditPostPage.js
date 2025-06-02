import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, updatePost, getCategories, getTags } from '../services/api'; // Assuming api.js exports these
import { ArrowLeftIcon } from '@heroicons/react/24/solid'; // Example icon

function EditPostPage() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('draft'); // 'draft' or 'published'
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  
  const [allCategories, setAllCategories] = useState([]);
  const [allTags, setAllTags] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState('');

  const fetchPostData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const postData = await getPostById(postId);
      setTitle(postData.title);
      setContent(postData.content);
      setStatus(postData.status);
      setSelectedCategories(postData.categories.map(cat => cat.id)); 
      setSelectedTags(postData.tags.map(tag => tag.id));

      const categoriesData = await getCategories();
      setAllCategories(categoriesData);

      const tagsData = await getTags();
      setAllTags(tagsData);

    } catch (err) {
      console.error('Failed to fetch post data:', err);
      setError('Failed to load post data. Please try again.');
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
    
    const postData = {
      title,
      content,
      status,
      category_ids: selectedCategories,
      tag_ids: selectedTags,
    };

    try {
      setLoading(true);
      await updatePost(postId, postData);
      navigate(`/manage-posts`); // Or to the post view page if one exists
    } catch (err) {
      console.error('Failed to update post:', err);
      setFormError('Failed to update post. Please try again.');
      setLoading(false);
    }
  };

  if (loading && !title) return <div className="p-8 text-center text-neutral-darkGray">Loading post editor...</div>;
  if (error) return <div className="p-8 text-center text-error">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8 bg-white shadow-lg rounded-lg">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
      >
        <ArrowLeftIcon className="h-5 w-5 mr-2" />
        Back
      </button>
      <h1 className="text-3xl font-bold mb-6 text-neutral-darkGray font-poppins">Edit Post</h1>
      {/* Placeholder for PostForm component. For now, a basic form: */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-neutral-darkGray">Title</label>
          <input 
            type="text" 
            id="title" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
            className="mt-1 block w-full px-3 py-2 border border-neutral-mediumGray rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-neutral-darkGray">Content</label>
          <textarea 
            id="content" 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            rows="10" 
            className="mt-1 block w-full px-3 py-2 border border-neutral-mediumGray rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
          ></textarea>
        </div>
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-neutral-darkGray">Status</label>
          <select 
            id="status" 
            value={status} 
            onChange={(e) => setStatus(e.target.value)} 
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-neutral-mediumGray focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
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
                className="h-4 w-4 text-primary border-neutral-mediumGray rounded focus:ring-primary"
              />
              <label htmlFor={`category-${category.id}`} className="ml-2 block text-sm text-neutral-darkGray">
                {category.name}
              </label>
            </div>
          )) : <p className="text-sm text-neutral-darkGray">No categories available. Create some first!</p>}
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
                className="h-4 w-4 text-primary border-neutral-mediumGray rounded focus:ring-primary"
              />
              <label htmlFor={`tag-${tag.id}`} className="ml-2 block text-sm text-neutral-darkGray">
                {tag.name}
              </label>
            </div>
          )) : <p className="text-sm text-neutral-darkGray">No tags available. Create some first!</p>}
        </div>

        {formError && <p className="text-sm text-error">{formError}</p>}
        
        <div className="flex justify-end space-x-3">
            <button 
                type="button" 
                onClick={() => navigate('/manage-posts')} 
                className="px-4 py-2 border border-neutral-mediumGray text-sm font-medium rounded-md text-neutral-darkGray bg-white hover:bg-neutral-lightGray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
                Cancel
            </button>
            <button 
                type="submit" 
                disabled={loading} 
                className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </form>
    </div>
  );
}

export default EditPostPage;
