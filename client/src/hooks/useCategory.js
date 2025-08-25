import { useState, useEffect } from "react";
import axios from "axios";

export default function useCategory() {
    const [categories, setCategories] = useState([]);
    const backendUrl = process.env.REACT_APP_BACKEND_URL || process.env.BACKEND_URL || "https://shopeklopek-api.vercel.app";

    // Fallback categories in case the API fails
    const fallbackCategories = [
        { _id: 'fallback-1', name: 'Electronics', slug: 'electronics' },
        { _id: 'fallback-2', name: 'Clothing', slug: 'clothing' },
        { _id: 'fallback-3', name: 'Books', slug: 'books' },
        { _id: 'fallback-4', name: 'Home & Garden', slug: 'home-garden' },
        { _id: 'fallback-5', name: 'Sports', slug: 'sports' },
    ];

    const getCategories = async () => {
        try {
            console.log('useCategory: Fetching categories from:', `${backendUrl}/api/v1/category/getcategories`);

            const { data } = await axios.get(`${backendUrl}/api/v1/category/getcategories`, {
                timeout: 15000, // Increased timeout to 15 seconds
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            console.log('useCategory: Categories response:', data);

            if (data?.success && data.categories && data.categories.length > 0) {
                const categoriesData = data.categories;
                setCategories(categoriesData);
                console.log('useCategory: Categories set:', categoriesData);
            } else {
                console.log('useCategory: No categories found, using fallback');
                setCategories(fallbackCategories);
            }
        } catch (error) {
            console.error('useCategory: Error fetching categories:', error);
            console.error('useCategory: Error response:', error.response);

            // If it's a 500 error or network error, use fallback categories
            if (error.response?.status === 500 || error.code === 'NETWORK_ERROR' || !error.response) {
                console.log('useCategory: Using fallback categories due to server error');
                setCategories(fallbackCategories);
            } else {
                setCategories([]);
            }
        }
    };

    useEffect(() => {
        getCategories();
    }, [backendUrl]);

    return categories;
}
