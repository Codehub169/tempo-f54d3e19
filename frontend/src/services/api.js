import axios from 'axios';
import { API_BASE_URL } from '../config';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Post API calls
export const getPosts = async () => {
  const response = await apiClient.get('/posts');
  return response.data;
};

export const getPost = async (id) => {
  const response = await apiClient.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData) => {
  const response = await apiClient.post('/posts', postData);
  return response.data;
};

export const updatePost = async (id, postData) => {
  const response = await apiClient.put(`/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id) => {
  const response = await apiClient.delete(`/posts/${id}`);
  return response.data;
};

// Category API calls
export const getCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data;
};

export const getCategory = async (id) => {
  const response = await apiClient.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (categoryData) => {
  const response = await apiClient.post('/categories', categoryData);
  return response.data;
};

export const updateCategory = async (id, categoryData) => {
  const response = await apiClient.put(`/categories/${id}`, categoryData);
  return response.data;
};

export const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/categories/${id}`);
  return response.data;
};

// Tag API calls
export const getTags = async () => {
  const response = await apiClient.get('/tags');
  return response.data;
};

export const getTag = async (id) => {
  const response = await apiClient.get(`/tags/${id}`);
  return response.data;
};

export const createTag = async (tagData) => {
  const response = await apiClient.post('/tags', tagData);
  return response.data;
};

export const updateTag = async (id, tagData) => {
  const response = await apiClient.put(`/tags/${id}`, tagData);
  return response.data;
};

export const deleteTag = async (id) => {
  const response = await apiClient.delete(`/tags/${id}`);
  return response.data;
};

export default apiClient;
