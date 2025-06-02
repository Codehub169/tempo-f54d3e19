import React, { useState, useEffect, useCallback } from 'react';
import { getTags, createTag, updateTag, deleteTag } from '../services/api';
import { TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

function ManageTagsPage() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState(null); // { id, name }
  const [formError, setFormError] = useState('');

  const fetchTags = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTags();
      setTags(data);
    } catch (err) {
      console.error('Failed to fetch tags:', err);
      setError('Failed to load tags. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  const handleCreateTag = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!newTagName.trim()) {
      setFormError('Tag name cannot be empty.');
      return;
    }
    try {
      const newTag = await createTag({ name: newTagName });
      setTags([...tags, newTag]);
      setNewTagName('');
    } catch (err) {
      console.error('Failed to create tag:', err);
      setFormError('Failed to create tag. Please try again.');
    }
  };

  const handleUpdateTag = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!editingTag || !editingTag.name.trim()) {
      setFormError('Tag name cannot be empty.');
      return;
    }
    try {
      const updated = await updateTag(editingTag.id, { name: editingTag.name });
      setTags(tags.map(t => t.id === editingTag.id ? updated : t));
      setEditingTag(null);
    } catch (err) {
      console.error('Failed to update tag:', err);
      setFormError('Failed to update tag. Please try again.');
    }
  };

  const handleDeleteTag = async (tagId) => {
    if (window.confirm('Are you sure you want to delete this tag? This might affect posts using it.')) {
      try {
        await deleteTag(tagId);
        setTags(tags.filter(tag => tag.id !== tagId));
      } catch (err) {
        console.error('Failed to delete tag:', err);
        setError('Failed to delete tag. Please try again.');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-neutral-darkGray">Loading tags...</div>;
  if (error && !editingTag) return <div className="p-8 text-center text-error">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-neutral-darkGray font-poppins">Manage Tags</h1>
      
      <form onSubmit={editingTag ? handleUpdateTag : handleCreateTag} className="mb-8 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-neutral-darkGray">{editingTag ? 'Edit Tag' : 'Add New Tag'}</h2>
        {formError && <p className="text-sm text-error mb-2">{formError}</p>}
        <div className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex-grow">
            <label htmlFor="tagName" className="sr-only">Tag Name</label>
            <input 
              type="text" 
              id="tagName" 
              placeholder="Enter tag name" 
              value={editingTag ? editingTag.name : newTagName} 
              onChange={(e) => editingTag ? setEditingTag({...editingTag, name: e.target.value}) : setNewTagName(e.target.value)} 
              className="block w-full px-3 py-2 border border-neutral-mediumGray rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>
          <button 
            type="submit" 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <PlusIcon className={`h-5 w-5 mr-2 ${editingTag ? 'hidden' : ''}`} />
            {editingTag ? 'Save Changes' : 'Add Tag'}
          </button>
          {editingTag && (
            <button 
              type="button" 
              onClick={() => { setEditingTag(null); setFormError(''); }}
              className="inline-flex items-center justify-center px-4 py-2 border border-neutral-mediumGray text-sm font-medium rounded-md text-neutral-darkGray bg-white hover:bg-neutral-lightGray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {tags.length === 0 && !loading ? (
        <p className="text-center text-neutral-darkGray py-4">No tags found. Add one above to get started!</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <ul className="divide-y divide-neutral-lightGray">
            {tags.map(tag => (
              <li key={tag.id} className="p-4 hover:bg-neutral-lightGray transition ease-in-out duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-darkGray">{tag.name} (Posts: {tag.post_count !== undefined ? tag.post_count : 'N/A'})</span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => { setEditingTag({ id: tag.id, name: tag.name }); setNewTagName(''); setFormError(''); window.scrollTo(0,0); }}
                      className="p-2 text-secondary hover:text-primary focus:outline-none"
                      title="Edit Tag"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteTag(tag.id)} 
                      className="p-2 text-error-dark hover:text-error focus:outline-none"
                      title="Delete Tag"
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

export default ManageTagsPage;
