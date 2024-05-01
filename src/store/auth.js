import { parseCookies, setCookie, destroyCookie } from 'nookies';
import create from 'zustand';
import axios from 'axios';

const api_url = 'http://127.0.0.1:8000/api/';

/*
User fields
- email: string
- password: string
- username: string
- avatar_url: string or null
- phone_number: string or null
- address: string or null
- user_type: int (0: seller, 1: buyer)
- achievements: string or null
- about: string or null
*/

const fetchUser = async () => {
    try {
        const { jwt } = parseCookies();
        const data = await axios.get(api_url + 'user/', {
            headers: {
                Authorization: `Bearer ${jwt}`
            }
        });
        setCookie(null, 'jwt', jwt, { maxAge: 60 * 60, path: '/' });
        return data.data;
    } catch (error) {
        console.log(error);
        return null;
    }
}

export const useAuthStore = create((set) => ({
    user: null,
    getUser: async () => {
        const data = await fetchUser();
        set({ user: data });
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
