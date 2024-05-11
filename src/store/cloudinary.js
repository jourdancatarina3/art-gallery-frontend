import create from 'zustand';
import axiosInstance from '@/utils/axios';

/*
Upload fields
- image file
- folder
- width
- height
- crop (fill)
*/


export const useCloudinaryStore = create((set) => ({
    uploadImage: async (data) => {
        console.log('heree')
        const formData = new FormData();
        Object.keys(data).forEach(key => {
            formData.append(key, data[key]);
        })

        try {
            const response = await axiosInstance.post('cloudinary/', formData);
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    deleteImage: async (url, folder) => {
        
        try {
            const response = await axiosInstance.delete('cloudinary/', { data: { url, folder } });
            return response.data;
        } catch (error) {
            console.log(error);
        }
    },

    deleteImageMany: async (urls, folder) => {
        console.log('here', urls)
        await Promise.all(urls.map(async (url) => {
            try {
                await axiosInstance.delete('cloudinary/', { data: { url, folder } });
            } catch (error) {
                console.log(error);
            }
        }))
    }
}));