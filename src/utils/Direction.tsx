import axios from 'axios';

export const getRouteFromLocationIQ = async (origin: any, destination: any) => {
  const { latitude: originLat, longitude: originLon } = origin;
  const { latitude: destLat, longitude: destLon } = destination;

  const locationIQApiKey = process.env.EXPO_PUBLIC_LOCATIONIQ_API_KEY;

  const url = `https://us1.locationiq.com/v1/directions/driving/${originLon},${originLat};${destLon},${destLat}`;

  try {
    const response = await axios.get(url, {
      params: {
        key: locationIQApiKey,
        overview: 'full', // Optional: Can be 'simplified' or 'full'
        geometries: 'geojson', // Default is polyline
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching directions from LocationIQ:', error);
    throw error;
  }
};
