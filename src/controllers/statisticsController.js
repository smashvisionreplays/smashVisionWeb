const API_URL = '/api/proxy';

export const fetchStatistics = async (clubId, startDate, endDate, authToken) => {
    try {
        const response = await fetch(
            `${API_URL}/statistics?clubId=${clubId}&startDate=${startDate}&endDate=${endDate}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching statistics:', error);
        throw error;
    }
};