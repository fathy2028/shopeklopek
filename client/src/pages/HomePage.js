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
    url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Modern Supermarket Interior'
  },
  {
    url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Fresh Produce Section'
  },
  {
    url: 'https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80',
    alt: 'Supermarket Aisles'
  },
  {
    url: 'https://images.unsplash.com/photo-1601599561213-832382fd07ba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Shopping Cart and Groceries'
  },
  {
    url: 'https://images.unsplash.com/photo-1534723452862-4c874018d66d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80',
    alt: 'Supermarket Checkout'
  }
];

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    getAllCategories();
  }, []);

  // Function to get the URL for category photo
  const getCategoryPhotoUrl = (categoryId) => {
    if (!categoryId) {
      return 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=No+Image';
    }
    return `${backendUrl}/api/v1/category/get-category-photo/${categoryId}`;
  };

  // Function to handle category click
  const handleCategoryClick = (categoryId) => {
    navigate(`/category/${categoryId}`);
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
              <div key={category._id} className='col-lg-3 col-md-4 col-sm-6 mb-4'>
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
    </Mylayout>
  );
};

export default HomePage;
