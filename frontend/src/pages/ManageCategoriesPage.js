import React, { useState, useEffect, useCallback } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../services/api';
import { TrashIcon, PencilIcon, PlusIcon } from '@heroicons/react/24/outline';

function ManageCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState(null); // { id, name }
  const [formError, setFormError] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setError('Failed to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!newCategoryName.trim()) {
      setFormError('Category name cannot be empty.');
      return;
    }
    try {
      const newCategory = await createCategory({ name: newCategoryName });
      setCategories([...categories, newCategory]);
      setNewCategoryName('');
    } catch (err) {
      console.error('Failed to create category:', err);
      setFormError('Failed to create category. Please try again.');
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!editingCategory || !editingCategory.name.trim()) {
      setFormError('Category name cannot be empty.');
      return;
    }
    try {
      const updated = await updateCategory(editingCategory.id, { name: editingCategory.name });
      setCategories(categories.map(cat => cat.id === editingCategory.id ? updated : cat));
      setEditingCategory(null);
    } catch (err) {
      console.error('Failed to update category:', err);
      setFormError('Failed to update category. Please try again.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category? This might affect posts using it.')) {
      try {
        await deleteCategory(categoryId);
        setCategories(categories.filter(category => category.id !== categoryId));
      } catch (err) {
        console.error('Failed to delete category:', err);
        setError('Failed to delete category. Please try again.');
      }
    }
  };

  if (loading) return <div className="p-8 text-center text-neutral-darkGray">Loading categories...</div>;
  if (error && !editingCategory) return <div className="p-8 text-center text-error">Error: {error}</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-6 text-neutral-darkGray font-poppins">Manage Categories</h1>
      
      {/* Form for adding/editing category */}
      <form onSubmit={editingCategory ? handleUpdateCategory : handleCreateCategory} className="mb-8 p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-neutral-darkGray">{editingCategory ? 'Edit Category' : 'Add New Category'}</h2>
        {formError && <p className="text-sm text-error mb-2">{formError}</p>}
        <div className="flex flex-col sm:flex-row sm:items-end space-y-2 sm:space-y-0 sm:space-x-2">
          <div className="flex-grow">
            <label htmlFor="categoryName" className="sr-only">Category Name</label>
            <input 
              type="text" 
              id="categoryName" 
              placeholder="Enter category name" 
              value={editingCategory ? editingCategory.name : newCategoryName} 
              onChange={(e) => editingCategory ? setEditingCategory({...editingCategory, name: e.target.value}) : setNewCategoryName(e.target.value)} 
              className="block w-full px-3 py-2 border border-neutral-mediumGray rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              required
            />
          </div>
          <button 
            type="submit" 
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <PlusIcon className={`h-5 w-5 mr-2 ${editingCategory ? 'hidden' : ''}`} />
            {editingCategory ? 'Save Changes' : 'Add Category'}
          </button>
          {editingCategory && (
            <button 
              type="button" 
              onClick={() => { setEditingCategory(null); setFormError(''); }}
              className="inline-flex items-center justify-center px-4 py-2 border border-neutral-mediumGray text-sm font-medium rounded-md text-neutral-darkGray bg-white hover:bg-neutral-lightGray focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {categories.length === 0 && !loading ? (
        <p className="text-center text-neutral-darkGray py-4">No categories found. Add one above to get started!</p>
      ) : (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <ul className="divide-y divide-neutral-lightGray">
            {categories.map(category => (
              <li key={category.id} className="p-4 hover:bg-neutral-lightGray transition ease-in-out duration-150">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-darkGray">{category.name} (Posts: {category.post_count !== undefined ? category.post_count : 'N/A'})</span>
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => { setEditingCategory({ id: category.id, name: category.name }); setNewCategoryName(''); setFormError(''); window.scrollTo(0,0); }}
                      className="p-2 text-secondary hover:text-primary focus:outline-none"
                      title="Edit Category"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteCategory(category.id)} 
                      className="p-2 text-error-dark hover:text-error focus:outline-none"
                      title="Delete Category"
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

export default ManageCategoriesPage;
