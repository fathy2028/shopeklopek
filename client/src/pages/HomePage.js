import React, { useState, useEffect } from 'react';
import Mylayout from '../components/Layout/Mylayout';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/home.css';
import Slider from 'react-slick';
import { useTranslation } from 'react-i18next';

const sliderImages = [
  {
    url: '/6-.jpg',
    alt: 'Modern Supermarket Interior'
  },
  {
    url: '/7-.jpg',
    alt: 'Fresh Produce Section'
  },
  {
    url: '/8.jpg',
    alt: 'Supermarket Aisles'
  },
  {
    url: '/9.jpg',
    alt: 'Shopping Cart and Groceries'
  }
  
];

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [bestOffers, setBestOffers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [offersLoading, setOffersLoading] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const backendUrl =  process.env.BACKEND_URL || "https://shopeklopek-api.vercel.app";
  const isRTL = i18n.language === 'ar';

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 1500,
    arrows: true,
    fade: false,
    pauseOnHover: true,
    rtl: false, // Keep slider LTR to avoid display issues
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          arrows: false,
          dots: true,
          rtl: false,
          adaptiveHeight: true
        }
      }
    ]
  };

  const getAllCategories = async () => {
    try {
      setLoading(true);
      console.log('Fetching categories from:', `${backendUrl}/api/v1/category/getcategories`);

      const { data } = await axios.get(`${backendUrl}/api/v1/category/getcategories`, {
        timeout: 10000, // 10 second timeout
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setLoading(false);
      console.log('Categories response:', data);

      if (data?.success) {
        const categoriesData = data.categories || [];
        setCategories(categoriesData);
        console.log('Categories set:', categoriesData);

        if (categoriesData.length === 0) {
          console.log('No categories found in database');
          // Don't show error for empty categories, just log it
        }
      } else {
        console.log('Failed to fetch categories:', data);
        setCategories([]); // Set empty array on failure
        toast.error(isRTL ? "فشل في جلب الفئات" : "Failed to fetch categories");
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching categories:', error);
      console.error('Error response:', error.response);
      console.error('Error status:', error.response?.status);
      console.error('Error data:', error.response?.data);

      setCategories([]); // Set empty array on error

      // More specific error messages
      if (error.response?.status === 500) {
        toast.error(isRTL ? "خطأ في الخادم - يرجى المحاولة لاحقاً" : "Server error - please try again later");
      } else if (error.code === 'ECONNABORTED') {
        toast.error(isRTL ? "انتهت مهلة الاتصال" : "Connection timeout");
      } else if (error.response?.status === 404) {
        toast.error(isRTL ? "الخدمة غير متوفرة" : "Service not available");
      } else {
        toast.error(isRTL ? "خطأ في جلب الفئات" : "Error while fetching categories");
      }
    }
  };

  const getBestOffers = async () => {
    try {
      setOffersLoading(true);
      console.log('Fetching best offers from:', `${backendUrl}/api/v1/product/product-list/1`);

      const { data } = await axios.get(`${backendUrl}/api/v1/product/product-list/1`, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json',
        }
      });

      setOffersLoading(false);
      console.log('Best offers response:', data);

      if (data?.success) {
        const offersData = data.products || [];
        setBestOffers(offersData);
        console.log('Best offers set:', offersData);
      } else {
        console.log('Failed to fetch best offers:', data);
        setBestOffers([]);
        toast.error(isRTL ? "فشل في جلب أفضل العروض" : "Failed to fetch best offers");
      }
    } catch (error) {
      setOffersLoading(false);
      console.error('Error fetching best offers:', error);
      setBestOffers([]);

      if (error.response?.status === 500) {
        toast.error(isRTL ? "خطأ في الخادم - يرجى المحاولة لاحقاً" : "Server error - please try again later");
      } else if (error.code === 'ECONNABORTED') {
        toast.error(isRTL ? "انتهت مهلة الاتصال" : "Connection timeout");
      } else {
        toast.error(isRTL ? "خطأ في جلب أفضل العروض" : "Error while fetching best offers");
      }
    }
  };

  useEffect(() => {
    getAllCategories();
    getBestOffers();
  }, []);

  // Function to get the URL for category photo
  const getCategoryPhotoUrl = (categoryId) => {
    if (!categoryId) {
      return 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=No+Image';
    }
    return `${backendUrl}/api/v1/category/get-category-photo/${categoryId}`;
  };

  // Function to get the URL for product photo
  const getProductPhotoUrl = (productId) => {
    if (!productId) {
      return 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=No+Image';
    }
    return `${backendUrl}/api/v1/product/get-product-photo/${productId}`;
  };

  // Function to handle category click
  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
  };

  // Function to handle product click
  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <Mylayout title={t('homepage.title')}>
      {/* Full-width slider */}
      <div className='slider-container-fullwidth' dir="ltr">
        <Slider {...sliderSettings}>
          {sliderImages.map((image, index) => (
            <div key={index}>
              <img
                src={image.url}
                alt={image.alt}
                className='slider-image-fullwidth'
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/1200x400/4A90E2/FFFFFF?text=Supermarket+Image';
                }}
              />
            </div>
          ))}
        </Slider>
      </div>

      {/* Hero Section with Shop Now Button */}
      <div className='container mt-5'>
        <div className='text-center mb-5'>
          <div className='hero-content' style={{
            background: 'linear-gradient(135deg, rgba(74, 144, 226, 0.1), rgba(255, 165, 0, 0.1))',
            borderRadius: '25px',
            padding: '60px 20px',
            marginBottom: '50px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%234A90E2" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
              animation: 'float 6s ease-in-out infinite'
            }}></div>
            {/* Logo */}
            <div className="mb-4 d-flex justify-content-center" style={{ position: 'relative', zIndex: 2 }}>
              <img
                src="/projectlogo.jpg"
                alt="Shopeklopek Logo"
                className="img-fluid"
                style={{
                  maxHeight: '300px',
                  width: 'auto',
                  borderRadius: '15px',
                  transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/200x120/4A90E2/FFFFFF?text=Logo';
                }}
              />
            </div>
            <h1 className='display-3 mb-4' style={{
              fontWeight: '800',
              background: 'linear-gradient(135deg, #4A90E2, #FF6B6B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              position: 'relative',
              zIndex: 2
            }}>
              {isRTL ? 'مرحباً بك في شبيك لبيك' : 'Welcome to  shopek lopek'}
            </h1>
            <p className='lead mb-4' style={{ 
              color: '#eb8a1bff', 
              fontSize: '1.3rem',
              position: 'relative',
              zIndex: 2
            }}>
              {isRTL ? 'كل طلبات البيت بين ايديك' : 'All your home needs at your fingertips'}
            </p>
            <button 
              className='btn btn-primary btn-lg shop-now-btn'
              onClick={() => navigate('/products')}
              style={{
                padding: '18px 40px',
                fontSize: '1.2rem',
                fontWeight: '600',
                borderRadius: '50px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                color: 'white',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
                zIndex: 2
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px) scale(1.05)';
                e.target.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0) scale(1)';
                e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.4)';
              }}
            >
              <i className="fas fa-shopping-bag me-3"></i>
              {isRTL ? 'تسوق الآن' : 'Shop Now'}
              <div style={{
                position: 'absolute',
                top: 0,
                left: '-100%',
                width: '100%',
                height: '100%',
                background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                transition: 'left 0.6s ease'
              }}></div>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Section */}
      <div className='container mt-5'>
        <div className='text-center mb-4'>
          <h1 className='display-4'>
            {t('homepage.shopByCategory')}
          </h1>
          <p className='lead text-muted'>
            {t('homepage.chooseFromCategories')}
          </p>
        </div>

        {loading ? (
          <div className='text-center'>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">{t('homepage.loading')}</span>
            </div>
          </div>
        ) : (
          <div className='row'>
            {categories.length > 0 ? categories.map(category => (
              <div key={category._id} className='col-lg-3 col-md-4 col-6 mb-4'>
                <div
                  className='category-card h-100'
                  onClick={() => handleCategoryClick(category._id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className='category-image-container'>
                    <img
                      src={getCategoryPhotoUrl(category._id)}
                      alt={category.name}
                      className='category-image'
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=' + encodeURIComponent(category.name);
                      }}
                    />
                  </div>
                  <div className='category-info'>
                    <h4 className='category-name'>{category.name}</h4>
                    <p className='category-delivery text-muted'>
                      {t('homepage.deliveryWithin')} {(() => {
                        const minutes = category.deliveryDuration || 1440;
                        if (minutes < 60) return `${minutes} ${t('homepage.minutes')}`;
                        if (minutes === 60) return `1 ${t('homepage.hours').slice(0, -1)}`; // Remove 's' for singular
                        if (minutes < 1440) {
                          const hours = Math.floor(minutes / 60);
                          return `${hours} ${t('homepage.hours')}`;
                        }
                        const days = Math.floor(minutes / 1440);
                        return `${days} ${t('homepage.days')}`;
                      })()}
                    </p>
                    <button className='btn btn-primary w-100'>
                      {t('homepage.browseProducts')}
                    </button>
                  </div>
                </div>
              </div>
            )) : (
              <div className='col-12 text-center'>
                <div className='alert alert-info'>
                  <h4>{t('homepage.noCategories')}</h4>
                  <p>{isRTL ? 'لا توجد فئات متاحة حالياً. يرجى المحاولة مرة أخرى لاحقاً.' : 'No categories available currently. Please try again later.'}</p>
                  <button
                    className='btn btn-primary'
                    onClick={() => getAllCategories()}
                  >
                    {isRTL ? 'إعادة المحاولة' : 'Retry'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Best Offers Section */}
      <div className='container mt-5 best-offers-section'>
        <div className='text-center mb-4'>
          <h1 className='display-4'>
            {isRTL ? 'أفضل العروض' : 'Best Offers'}
          </h1>
          <p className='lead text-muted'>
            {isRTL ? 'اكتشف أحدث المنتجات وأفضل الأسعار' : 'Discover the latest products and best prices'}
          </p>
        </div>

        {offersLoading ? (
          <div className='text-center'>
            <div className="spinner-border" role="status">
              <span className="visually-hidden">{isRTL ? 'جاري التحميل...' : 'Loading...'}</span>
            </div>
          </div>
        ) : (
          <div className='row'>
            {bestOffers.length > 0 ? bestOffers.map(product => (
              <div key={product._id} className='col-lg-3 col-md-4 col-6 mb-4'>
                <div className='product-card h-100'>
                <img
                  src={getProductPhotoUrl(product._id)}
                  alt={product.name}
                  className='product-image'
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=' + encodeURIComponent(product.name);
                  }}
                />
                <div className='product-info'>
                  <h3 className='product-name'>{product.name}</h3>
                  <p className='product-description'>
                    {product.description && product.description.length > 100 
                      ? `${product.description.substring(0, 100)}...` 
                      : product.description}
                  </p>
                  <p className='product-price'>
                    ${product.price}
                  </p>
                </div>
                <div className='product-buttons'>
                  <button 
                    className='btn btn-primary'
                    onClick={() => handleProductClick(product._id)}
                  >
                    {isRTL ? 'عرض التفاصيل' : 'View Details'}
                  </button>
                </div>
                </div>
              </div>
            )) : (
              <div className='col-12 text-center'>
                <div className='alert alert-info'>
                  <h4>{isRTL ? 'لا توجد عروض متاحة' : 'No offers available'}</h4>
                  <p>{isRTL ? 'لا توجد منتجات متاحة حالياً. يرجى المحاولة مرة أخرى لاحقاً.' : 'No products available currently. Please try again later.'}</p>
                  <button
                    className='btn btn-primary'
                    onClick={() => getBestOffers()}
                  >
                    {isRTL ? 'إعادة المحاولة' : 'Retry'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Mylayout>
  );
};

export default HomePage;
