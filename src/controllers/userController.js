const API_BASE_URL = `/api/proxy`;

export const fetchUserMetadata = async (userId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users/metadata/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch user metadata');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching user metadata:', error);
    throw error;
  }
};