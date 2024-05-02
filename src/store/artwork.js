import create from 'zustand';
import axios from 'axios';

const api_url = 'http://127.0.0.1:8000/api/';

/*
Artwork fields
- artist_id: int
- buyer_id: int
- category_id: int or null
- title: string
- description: string
- starting_bid: float or null
- status: int (0: open, 1: reserved, 2: sold)
*/

export const useArtworkStore = create((set) => ({
    fetchArtworks: async (filters) => {
        try {
            const data = await axios.get(api_url + 'artworks/', { params: filters });
            return data.data;
        } catch (error) {
            console.log(error);
        }
    },

    fetchArtwork: async (id) => {
        try {
            const data = await axios.get(api_url + `artworks/${id}/`);
            return data.data;
        } catch (error) {
            console.log(error);
        }
    },

    createArtwork: async (data) => {
        try {
            const response = await axios.post(api_url + 'artworks/', data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    updateArtwork: async (id, data) => {
        try {
            const response = await axios.put(api_url + `artworks/${id}/`, data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    deleteArtwork: async (id) => {
        try {
            const response = await axios.delete(api_url + `artworks/${id}/`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    fetchCategories: async (filters) => {
        try {
            const data = await axios.get(api_url + 'categories/', { params: filters });
            return data.data;
        } catch (error) {
            console.log(error);
        }
    },
}));