import { parseCookies, setCookie, destroyCookie } from 'nookies';
import create from 'zustand';
import axiosInstance from '@/utils/axios';


/*
User fields
- email: string
- password: string
- username: string
- avatar_url: string or null
- phone_number: string or null
- location: string or null
- user_type: int (0: seller, 1: buyer)
- achievements: string or null
- about: string or null
*/

const fetchUser = async () => {
    try {
        const { jwt } = parseCookies();
        const data = await axiosInstance.get('user/');
        // setCookie(null, 'jwt', jwt, { maxAge: 60 * 60 * 24 *  7, path: '/' });
        return data.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const useAuthStore = create((set) => ({
    user: null,
    defaultAvatarUrl: 'https://img.freepik.com/free-photo/graffiti-children-bicycle_1122-2206.jpg?t=st=1714461301~exp',
    getUser: async () => {
        const data = await fetchUser();
        set({ user: data });
    },
    login: async (email, password) => {
        console.log('herere')
        try {
            const data = await axiosInstance.post('login/', { email, password })
            const jwt_token = data.data.jwt;
            setCookie(null, 'jwt', jwt_token, { maxAge: 60 * 60 * 24 * 365, path: '/' });
            set({ user: data.data.user });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    checkEmailAvailability: async (email) => {
        try {
            const data = await axiosInstance.get('check-email/', { params: {email} });
            return data.data;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
    register: async (data) => {
        try {
            const response = await axiosInstance.post('register/', data);
            return response.data;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
}));
