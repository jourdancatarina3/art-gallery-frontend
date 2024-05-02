import create from 'zustand';
import axios from 'axios';

const api_url = 'http://127.0.0.1:8000/api/';

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
            const data = await axios.get(api_url + 'bids/', { params: filters });
            return data.data;
        } catch (error) {
            console.log(error);
        }
    },

    fetchBid: async (id) => {
        try {
            const data = await axios.get(api_url + `bids/${id}/`);
            return data.data;
        } catch (error) {
            console.log(error);
        }
    },

    createBid: async (data) => {
        try {
            const response = await axios.post(api_url + 'bids/', data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    updateBid: async (id, data) => {
        try {
            const response = await axios.put(api_url + `bids/${id}/`, data);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    deleteBid: async (id) => {
        try {
            const response = await axios.delete(api_url + `bids/${id}/`);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },
}));