// When the frontend is served by the same backend server (same origin),
// relative URLs for API calls are simpler and more robust.
// This configuration allows overriding via REACT_APP_API_BASE_URL for other scenarios.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

export { API_BASE_URL };
