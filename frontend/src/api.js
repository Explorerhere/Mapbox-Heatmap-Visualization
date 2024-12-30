import axios from 'axios';

// Fetch locations from backend
export const fetchLocations = async () => {
    const response = await axios.get('http://localhost:5000/locations');
    return response.data;
};
