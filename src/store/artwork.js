import create from 'zustand';
import axiosInstance from '@/utils/axios';

// Note: computed fields are fields that are derived from other fields in the model
/*
Artwork fields
- artist_id: int
- buyer_id: int
- category_id: int or null
- title: string
- description: string
- starting_bid: float or null
- status: int (0: open, 1: reserved, 2: sold)
- image_urls: [string]
- sold_price: float or null
- viewers_count: COMPUTED field (int)
- slug: COMPUTED field (string)
- first_image: COMPUTED field (object)
*/

export const useArtworkStore = create((set) => ({
    fetchArtworks: async (filters) => {
        try {
            const data = await axiosInstance.get('artworks/', { params: filters });
            return data.data;
        } catch (error) {
            console.log(error);
        }
    },

    fetchArtwork: async (id) => {
        try {
            const data = await axiosInstance.get(`artworks/${id}/`);
            return data.data;
        } catch (error) {
            console.log(error);
        }
    },

    createArtwork: async (data) => {
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            if (key === 'image_urls') {
                data[key].forEach((image) => {
                    formData.append('image_urls', image);
                });
            } else {
                formData.append(key, data[key]);
            }
        });
        try {
            const response = await axiosInstance.post('artworks/', data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    updateArtwork: async (id, data) => {
        try {
            const response = await axiosInstance.put(`artworks/${id}/`, data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    deleteArtwork: async (id) => {
        try {
            const response = await axiosInstance.delete(`artworks/${id}/`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    fetchCategories: async (filters) => {
        try {
            const data = await axiosInstance.get('categories/', { params: filters });
            return data.data;
        } catch (error) {
            console.log(error);
        }
    },

    fetchTopArtist: async () => {
        try {
            const data = await axiosInstance.get('top-artists/');
            return data.data;
        } catch (error) {
            console.log(error);
        }
    },

    fetchFeaturedArtworks: async () => {
        try {
            const data = await axiosInstance.get('featured-artworks/');
            return data.data;
        } catch (error) {
            console.log(error);
        }
    },

    createCategory: async (data) => {
        try {
            const response = await axiosInstance.post('categories/', { name: data });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    fetchLikes: async (filters) => {
        try {
            const response = await axiosInstance.get('likes/', { params: filters });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    createLike: async (data) => {
        try {
            const response = await axiosInstance.post('likes/', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteLike: async (id) => {
        try {
            const response = await axiosInstance.delete(`likes/${id}/`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    fetchLikedArtworks: async (id, filters={}) => {
        try {
            const response = await axiosInstance.get(`liked-artworks/${id}/`, { params: filters });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}));