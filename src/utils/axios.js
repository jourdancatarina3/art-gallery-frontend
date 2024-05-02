import axios from 'axios';
import { useRouter } from 'next/navigation';
import { parseCookies } from 'nookies';

const api_url = 'http://127.0.0.1:8000/api/';

const { jwt } = parseCookies();
const axiosInstance = axios.create({
    baseURL: api_url,
    headers: {
        Authorization: jwt ? `Bearer ${jwt}` : ''
    }
})

axiosInstance.interceptors.response.use(
    response => response,
    error => {
        if (error.response.status === 401) {
            const router = useRouter()
            router.push('/login')
        } else if (error.response.status === 403) {
            const router = useRouter()
            router.push('/') // access denied page
        } else if (error.response.status === 404) {
            const router = useRouter()
            router.push('/404') // not found page
        }
        return Promise.reject(error);
    }
)

export default axiosInstance;