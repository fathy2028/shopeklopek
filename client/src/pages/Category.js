import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import Mylayout from '../components/Layout/Mylayout';
import { useCart } from '../context/cart';
import { useTranslation } from 'react-i18next';
import '../styles/home.css';

const Category = () => {
    const { id } = useParams(); // Get category ID from the URL
    const [products, setProducts] = useState([]);
    const [category, setCategory] = useState({});
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cart, setCart] = useCart();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const backendUrl = process.env.BACKEND_URL || "https://shopeklopek-api.vercel.app";
    const isRTL = i18n.language === 'ar';
    const currency = i18n.language === 'ar' ? 'جنية' : 'EGP';

    const fetchCategoryDetails = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/v1/category/getcategory/${id}`);
            if (data?.success) {
                setCategory(data.category);
            } else {
                toast.error(isRTL ? "فشل في جلب تفاصيل الفئة" : "Failed to fetch category details");
            }
        } catch (error) {
            console.log(error);
            toast.error(isRTL ? "خطأ في جلب تفاصيل الفئة" : "Error while fetching category details");
        }
    };

    const fetchProductsByCategory = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`${backendUrl}/api/v1/product/productsbycategory/${id}`);
            setLoading(false);
            if (data?.success) {
                setProducts(data.products);
            } else {
                toast.error(isRTL ? "فشل في جلب المنتجات" : "Failed to fetch products");
            }
        } catch (error) {
            setLoading(false);
            console.log(error);
            toast.error(isRTL ? "خطأ في جلب المنتجات" : "Error while fetching products");
        }
    };

    const fetchAllCategories = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/v1/category/getcategories`);
            if (data?.success) {
                setCategories(data.categories);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchAllCategories();
        if (id) {
            fetchCategoryDetails();
            fetchProductsByCategory();
        }
    }, [id]);

    // Function to get the URL for product photo
    const getProductPhotoUrl = (productId) => {
        return `${backendUrl}/api/v1/product/get-product-photo/${productId}`;
    };

    return (
        <Mylayout title={`${isRTL ? 'منتجات' : 'Products in'} ${category.name || ''} - ${isRTL ? 'شبيك لبيك' : 'Shopeklopek'}`}>
            <div className='container mt-4'>
                <div className='row'>
                    <div className='col-md-12'>
                        {/* Category Header */}
                        <div className='text-center mb-4'>
                            <h1 className='display-5'>
                                {category.name ? (
                                    isRTL ? `منتجات ${category.name}` : `${category.name} Products`
                                ) : (
                                    isRTL ? 'منتجات الفئة' : 'Category Products'
                                )}
                            </h1>
                            
                            {/* Category Navigation */}
                            {categories.length > 0 && (
                                <div className="mb-4">
                                    <div className="dropdown d-inline-block">
                                        <button 
                                            className="btn btn-outline-primary dropdown-toggle" 
                                            type="button" 
                                            data-bs-toggle="dropdown"
                                            style={{ borderRadius: '25px', padding: '10px 20px' }}
                                        >
                                            <i className="fas fa-list me-2"></i>
                                            {isRTL ? 'تصفح الفئات الأخرى' : 'Browse Other Categories'}
                                        </button>
                                        <ul className="dropdown-menu" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                            {categories.map(cat => (
                                                <li key={cat._id}>
                                                    <button 
                                                        className={`dropdown-item ${cat._id === id ? 'active' : ''}`}
                                                        onClick={() => navigate(`/category/${cat._id}`)}
                                                        style={{ 
                                                            fontWeight: cat._id === id ? 'bold' : 'normal',
                                                            backgroundColor: cat._id === id ? '#e3f2fd' : 'transparent'
                                                        }}
                                                    >
                                                        {cat.name}
                                                        {cat._id === id && <i className="fas fa-check ms-2 text-success"></i>}
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}
                            {category.deliveryDuration && (
                                <p className='lead text-muted'>
                                    {isRTL ? 'التوصيل خلال: ' : 'Delivery within: '}
                                    {(() => {
                                        const minutes = category.deliveryDuration;
                                        if (minutes < 60) return `${minutes} ${isRTL ? 'دقيقة' : 'minutes'}`;
                                        if (minutes === 60) return isRTL ? 'ساعة واحدة' : '1 hour';
                                        if (minutes < 1440) {
                                            const hours = Math.floor(minutes / 60);
                                            return `${hours} ${isRTL ? 'ساعة' : 'hours'}`;
                                        }
                                        const days = Math.floor(minutes / 1440);
                                        return `${days} ${isRTL ? 'يوم' : 'days'}`;
                                    })()}
                                </p>
                            )}
                        </div>

                        {/* Loading State */}
                        {loading ? (
                            <div className='text-center'>
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">{isRTL ? 'جاري التحميل...' : 'Loading...'}</span>
                                </div>
                            </div>
                        ) : (
                            /* Products Grid */
                            <div className='row'>
                                {products.length > 0 ? (
                                    products.map(product => (
                                        <div key={product._id} className='col-lg-3 col-md-4 col-6 mb-4'>
                                            <div className='product-card h-100'>
                                            <img
                                                src={getProductPhotoUrl(product._id)}
                                                alt={product.name}
                                                className='product-image'
                                                style={{ objectFit: "cover", height: "200px" }}
                                            />
                                            <div className='product-info'>
                                                <h3 className='product-name'>{product.name}</h3>
                                                <p className='product-description'>{product.description.substring(0, 40)}...</p>
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

                                                        const updatedCart = [...cart, product];
                                                        setCart(updatedCart);
                                                        localStorage.setItem("cart", JSON.stringify(updatedCart));
                                                        toast.success(isRTL ? "تم إضافة العنصر إلى السلة بنجاح" : "Item added to cart successfully");
                                                    }}
                                                >
                                                    <i className="fas fa-shopping-cart me-2"></i>
                                                    {isRTL ? 'أضف إلى السلة' : 'Add to Cart'}
                                                </button>
                                            </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className='col-12 text-center'>
                                        <div className='alert alert-info'>
                                            <h4>{isRTL ? 'لا توجد منتجات' : 'No Products Found'}</h4>
                                            <p>{isRTL ? 'لا توجد منتجات في هذه الفئة حالياً' : 'No products found in this category currently'}</p>
                                            <button
                                                className='btn btn-primary'
                                                onClick={() => navigate('/')}
                                            >
                                                {isRTL ? 'العودة إلى الرئيسية' : 'Back to Home'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Mylayout>
    );
};

export default Category;
