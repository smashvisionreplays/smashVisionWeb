import axios from "axios";

const API_BASE_URL = `/api/proxy`;

export const fetchClubs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clubs`);
    return response.data;
  } catch (error) {
    console.error("Error fetching clubs:", error);
    throw error;
  }
};
export const fetchBestPoints = async (params) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/videos/bestPoints`, params);
    return response.data;
  } catch (error) {
    console.error("Error fetching best points:", error);
    throw error;
  }
}

export const fetchVideos = async (params) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/videos`, params);
    return response.data;
  } catch (error) {
    console.error("Error fetching videos:", error);
    throw error;
  }
};

export const fetchCourtVideos = async (clubId, courtNumber) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/videos/court/${clubId}/${courtNumber}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching court videos in controller:`, error);
    throw error;
  }
};

export const fetchClubVideos = async (clubId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/videos/club/${clubId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching videos for club in controller${clubId}:`, error);
      throw error;
    }
};

export const fetchClubClips = async (clubId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clips/club/${clubId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching clips for club ${clubId} in controller:`, error);
    throw error;
  }
};

export const fetchMemberClips = async (memberId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clips/member/${memberId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching clips for member ${memberId} in controller:`, error);
    throw error;
  }
};

export const fetchClubCameras= async (clubId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/cameras/club/${clubId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching cameras for club in controller${clubId}:`, error);
    throw error;
  }
};

export async function fetchClubById(id) {
    try {
        const response = await axios.get(`${API_BASE_URL}/clubs/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching club:', error.response?.data ?? error.message);
        return null;
    }
}

export async function registerClip(uid, tag, clubId, userId, startTime, endTime, authToken = null, note = '') {
  try {
      const headers = {
          'Content-Type': 'application/json',
      };

      // Add authorization header if token is provided
      if (authToken) {
          headers['Authorization'] = `Bearer ${authToken}`;
      }

      const response = await fetch(`${API_BASE_URL}/clips`, {
          method: 'POST',
          headers,
          body: JSON.stringify({uid, tag, clubId, userId, startTime, endTime, note}),
      });

      const data = await response.json();
      if (!response.ok) {
          return { success: false, reason: data.reason || 'unknown' };
      }
      return data;
  } catch (error) {
      console.error('Error registering clip:', error);
      return { success: false, error: 'network' };
  }
}

export async function fetchVideoData(uid) {
  try {
      const response = await fetch(`${API_BASE_URL}/videos/${uid}`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Failed to fetch video Data');
      }

      return await response.json();
  } catch (error) {
      console.error('Error fetching video data:', error);
      return null;
  }
}

export async function fetchDownload(uid) {
  try {
      const response = await fetch(`${API_BASE_URL}/clips/${uid}/cloudflare/download`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Failed to fetch download Data');
      }

      return await response.json();
  } catch (error) {
      console.error('Error fetching download data:', error);
      return null;
  }
}

export async function createDownload(uid) {
  try {
      const response = await fetch(`${API_BASE_URL}/clips/${uid}/download`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Failed to create download');
      }

      return await response.json();
  } catch (error) {
      console.error('Error creating download:', error);
      return null;
  }
}

// Downloads the clip itself instead of handing the browser a URL, so it can be
// passed to the native share sheet as a file. `variant` picks the original 16:9
// clip or the 9:16 render made for Instagram stories. Throws so the caller can
// fall back to a plain download.
export async function fetchClipFile(uid, variant = 'clip') {
  const path = variant === 'story' ? 'story/file' : 'download/file';
  const response = await fetch(`${API_BASE_URL}/clips/${uid}/${path}`);

  if (!response.ok) {
      // 503 means the API is rendering as much as it can right now; callers
      // tell the user to retry rather than showing a hard failure.
      const error = new Error(`Failed to download clip file (${response.status})`);
      error.status = response.status;
      throw error;
  }

  return await response.blob();
}

export async function selectDownload(uid) {
  try {
      const response = await fetch(`${API_BASE_URL}/clips/${uid}/download`, {
          method: 'GET',
          headers: {
              'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
          throw new Error('Failed to create download');
      }

      return await response.json();
  } catch (error) {
      console.error('Error creating download:', error);
      return null;
  }
}

export async function updateDownload(downloadURL, uid) {
  try {
      const response = await fetch(`${API_BASE_URL}/clips/${uid}/download`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({downloadURL}),
      });

      if (!response.ok) {
          throw new Error('Failed to update download');
      }

      return await response.json();
  } catch (error) {
      console.error('Error updating download:', error);
      return null;
  }
}

export async function toggleCameraLive(cameraId, clubId, courtNumber, newStatus) {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras/${cameraId}/toggleLive`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clubId, courtNumber, newStatus }),
    });
    if (!response.ok) {
      throw new Error('Failed to toggle live status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error toggling camera live:', error);
    throw error;
  }
}

export async function fetchBlockVideo(videoId) {
  try {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}/block`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
    });

      if (!response.ok) {
          throw new Error('Failed to block video');
      }
      return await response.json();
  } catch (error) {
      console.error('Error blocking video:', error);
      return null;
  }
}

export async function fetchUnblockVideo(videoId) {
  try {
    const response = await fetch(`${API_BASE_URL}/videos/${videoId}/unblock`, {
      method: 'PUT',
      headers: {
          'Content-Type': 'application/json',
      },
    });

      if (!response.ok) {
          throw new Error('Failed to block video');
      }
      return await response.json();
  } catch (error) {
      console.error('Error blocking video:', error);
      return null;
  }
}

export async function deleteClip(clipId, token) {
  const response = await fetch(`${API_BASE_URL}/clips/${clipId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error('Failed to delete clip');
  return await response.json();
}

// Add other API functions as needed
