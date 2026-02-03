import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

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
    // Mock data for testing
    const mockData = [
      { Time: "19:38:15" },
      { Time: "19:42:30" },
      { Time: "19:47:18" },
      { Time: "19:51:45" },
      { Time: "19:56:12" },
      { Time: "20:02:33" }
    ];
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return mockData;
    
    // Original API call (commented out for now)
    // const response = await axios.post(`${API_BASE_URL}/videos/bestPoints`, params);
    // return response.data;
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
      // // console.log(`sending to ${API_BASE_URL}/clubs/${id}` )
        const response = await fetch(`${API_BASE_URL}/clubs/${id}`); // Update URL as needed
        
        if (!response.ok) {
            throw new Error('Failed to fetch club data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching club:', error);
        return null;
    }
}

export async function registerClip(uid, tag, clubId, userId, startTime, endTime, authToken = null) {
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
          body: JSON.stringify({uid, tag, clubId, userId, startTime, endTime}),
      });

      if (!response.ok) {
          throw new Error('Failed to register clip');
      }

      return await response.json();
  } catch (error) {
      console.error('Error registering clip:', error);
      return null;
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

export async function createYoutubeLive(clubName, courtNumber, authToken) {
  try {
    const response = await fetch(`${API_BASE_URL}/youtube/create-live`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ clubName, courtNumber }),
    });

    if (!response.ok) {
        throw new Error('Failed to create YouTube live stream');
    }
    return await response.json();
  } catch (error) {
      console.error('Error creating YouTube live:', error);
      return null;
  }
}

export async function checkYouTubeStatus(authToken) {
  try {
    const response = await fetch(`${API_BASE_URL}/youtube/status`, {
      method: 'GET',
      headers: {
          'Authorization': `Bearer ${authToken}`
      },
    });

    if (!response.ok) {
        throw new Error('Failed to check YouTube status');
    }
    return await response.json();
  } catch (error) {
      console.error('Error checking YouTube status:', error);
      return null;
  }
}

export async function disconnectYouTube(authToken) {
  try {
    const response = await fetch(`${API_BASE_URL}/youtube/disconnect`, {
      method: 'POST',
      headers: {
          'Authorization': `Bearer ${authToken}`
      },
    });

    if (!response.ok) {
        throw new Error('Failed to disconnect YouTube');
    }
    return await response.json();
  } catch (error) {
      console.error('Error disconnecting YouTube:', error);
      return null;
  }
}

export async function fetchStartStream(clubId, cameraId, cameraIp, court, rtmpKey, clubEndpoint, watchUrl) {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras/${cameraId}/startLive`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({clubId, cameraId, court,cameraIp, rtmpKey, clubEndpoint, watchUrl}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      const error = new Error(errorData.message || 'Failed to start live stream');
      error.isClubServerDown = errorData.isClubServerDown;
      error.status = response.status;
      throw error;
    }
    return await response.json();
  } catch (error) {
      console.error('Error fetching start live:', error);
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

export async function fetchStopStream(clubId, cameraId, cameraIp, clubEndpoint) {
  try {
    const response = await fetch(`${API_BASE_URL}/cameras/${cameraId}/stopLive`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({clubId, cameraId, cameraIp, clubEndpoint}),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      const error = new Error(errorData.message || 'Failed to stop stream');
      error.isClubServerDown = errorData.isClubServerDown;
      error.status = response.status;
      throw error;
    }
    return await response.json();
  } catch (error) {
      console.error('Error stopping stream:', error);
      throw error;
  }
}

// Add other API functions as needed
