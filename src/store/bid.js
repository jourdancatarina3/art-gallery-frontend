import create from 'zustand';
import axiosInstance from '@/utils/axios';

/*
Bid fields
- artwork_id: int
- user_id: int
- is_anonymous: bool
- bid_amount: float
*/

export const useBidStore = create((set) => ({
    fetchBids: async (filters) => {
        try {
            const data = await axios.get('bids/', { params: filters });
            return data.data;
        } catch (error) {
            console.log(error);
        }
    },

    fetchBid: async (id) => {
        try {
            const data = await axios.get(`bids/${id}/`);
            return data.data;
        } catch (error) {
            console.log(error);
        }
    },

    createBid: async (data) => {
        try {
            const response = await axios.post('bids/', data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    updateBid: async (id, data) => {
        try {
            const response = await axios.put(`bids/${id}/`, data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    deleteBid: async (id) => {
        try {
            const response = await axios.delete(`bids/${id}/`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
}));