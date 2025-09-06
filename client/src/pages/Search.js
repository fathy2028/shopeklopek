import React, { useEffect } from 'react';
import Mylayout from '../components/Layout/Mylayout';
import { useSearch } from '../context/search';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';

const Search = () => {
    const [values] = useSearch();
    const navigate = useNavigate();
    const [cart, setCart] = useCart();
    const { t, i18n } = useTranslation();
    const backendUrl = process.env.BACKEND_URL || "https://shopeklopek-api.vercel.app";
    const isRTL = i18n.language === 'ar';
    const currency = i18n.language === 'ar' ? 'جنية' : 'EGP';

    // Function to get the URL for product photo
    const getProductPhotoUrl = (productId) => {
        return `${backendUrl}/api/v1/product/get-product-photo/${productId}`;
    };

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, []);

    return (
        <Mylayout title={"Search - Queen Pharmacy"}>
            <div className='container'>
                <div className='text-center'>
                    <h1>Search Result</h1>
                    <h6>{`Found ${values?.results.length} product(s)`}</h6>
                    <div className='row mt-4'>
                        {values?.results.length > 0 ? values?.results.map(product => (
                            <div key={product._id} className='col-lg-3 col-md-4 col-6 mb-4'>
                                <div className='product-card h-100'>
                                <img 
                                    style={{ objectFit: "cover" }} 
                                    src={getProductPhotoUrl(product._id)} 
                                    alt={product.name} 
                                    className='product-image' 
                                />
                                <div className='product-info'>
                                    <h3 className='product-name'>{product.name}</h3>
                                    <p className='product-description'>{product.description.substring(0, 40)}</p>
                                    <p className='product-price'>
                                      {isRTL ? (
                                        <><b>{product.price}</b> {currency}</>
                                      ) : (
                                        <><b>{currency}</b> {product.price}</>
                                      )}
                                    </p>
                                </div>
                                <div className='product-buttons'>
                                    <button
                                        className='btn btn-primary'
                                        onClick={(e) => {
                                            // Add success animation
                                            e.target.classList.add('success-animation');
                                            setTimeout(() => {
                                                e.target.classList.remove('success-animation');
                                            }, 600);

                                            setCart([...cart, product]);
                                            toast.success("Item added to cart successfully");
                                            localStorage.setItem("cart", JSON.stringify([...cart, product]));
                                        }}
                                    >
                                        <i className="fas fa-shopping-cart me-2"></i>
                                        Add to Cart
                                    </button>
                                </div>
                                </div>
                            </div>
                        )) : <div className="col-12"><p>No products found</p></div>}
                    </div>
                </div>
            </div>
        </Mylayout>
    );
};

export default Search;
