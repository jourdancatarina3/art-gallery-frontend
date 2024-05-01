import create from 'zustand';
import axios from 'axios';
import { parseCookies, setCookie, destroyCookie } from 'nookies';

const api_url = 'http://127.0.0.1:8000/api/';

export const useAuthStore = create((set) => ({
    user: null,
    getUser: async () => {
        try {
            const { jwt } = parseCookies();
            const data = await axios.get(api_url + 'user/', {
                headers: {
                    Authorization: `Bearer ${jwt}`
                }
            });
            setCookie(null, 'jwt', jwt, { maxAge: 60 * 60, path: '/' });
            set({ user: data.data });
        } catch (error) {
            console.log(error);
        };
    },
    login: async (email, password) => {
        try {
            const data = await axios.post(api_url + 'login/', { email, password })
            const jwt_token = data.data.jwt;
            setCookie(null, 'jwt', jwt_token, { maxAge: 60 * 60, path: '/' });
            set({ user: data.data.user });
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    },
}));
