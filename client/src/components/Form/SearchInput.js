import React from 'react';
import { useSearch } from '../../context/search';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SearchInput = () => {
    const [values, setValues] = useSearch();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const backendUrl = process.env.BACKEND_URL || "https://shopeklopek-api.vercel.app";
    const isRTL = i18n.language === 'ar';

    const fetchAllProducts = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/v1/product/getall-products`);
            setValues({ ...values, results: data.products });
        } catch (error) {
            console.log(error);
        }
    };

    const handlesubmit = async (e) => {
        e.preventDefault();
        if (values.keyword.trim() === "") {
            await fetchAllProducts();
            navigate("/search");
        } else {
            try {
                const { data } = await axios.get(`${backendUrl}/api/v1/product/search/${values.keyword}`);
                setValues({ ...values, results: data });
                navigate("/search");
            } catch (error) {
                console.log(error);
            }
        }
    };

    const handleInputChange = (e) => {
        const keyword = e.target.value;
        setValues({ ...values, keyword });
    };

    return (
        <div className="search-input-wrapper">
            <form className="search-form" role="search" onSubmit={handlesubmit}>
                <div className="search-input-group">
                    <input
                        className="search-input"
                        type="search"
                        placeholder={t('common.search')}
                        aria-label={t('common.search')}
                        value={values.keyword}
                        onChange={handleInputChange}
                        dir={isRTL ? 'rtl' : 'ltr'}
                    />
                    <button
                        className="search-btn"
                        type="submit"
                    >
                        <i className="fas fa-search"></i>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchInput;
