import React, { useState, useEffect } from 'react';
import Mylayout from '../components/Layout/Mylayout';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/cart';
import { useTranslation } from 'react-i18next';
import '../styles/home.css';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const backendUrl = process.env.BACKEND_URL || "https://shopeklopek-api.vercel.app";
  const isRTL = i18n.language === 'ar';

  // Get all products
  const getAllProducts = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`${backendUrl}/api/v1/product/getall-products`);
      setLoading(false);
      if (data?.success) {
        setProducts(data.products);
      } else {
        toast.error(isRTL ? "فشل في جلب المنتجات" : "Failed to fetch products");
      }
    } catch (error) {
      setLoading(false);
      console.error('Error fetching products:', error);
      toast.error(isRTL ? "خطأ في جلب المنتجات" : "Error while fetching products");
    }
  };

  useEffect(() => {
    getAllProducts();
  }, []);

  // Function to get the URL for product photo
  const getProductPhotoUrl = (productId) => {
    if (!productId) {
      return 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=No+Image';
    }
    return `${backendUrl}/api/v1/product/get-product-photo/${productId}`;
  };

  // Add to cart function
  const addToCart = (product) => {
    try {
      const existingCart = [...cart];
      const existingProductIndex = existingCart.findIndex(item => item._id === product._id);
      
      if (existingProductIndex > -1) {
        existingCart[existingProductIndex].quantity += 1;
      } else {
        existingCart.push({ ...product, quantity: 1 });
      }
      
      setCart(existingCart);
      localStorage.setItem('cart', JSON.stringify(existingCart));
      toast.success(isRTL ? 'تم إضافة المنتج إلى السلة' : 'Product added to cart');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(isRTL ? 'خطأ في إضافة المنتج' : 'Error adding product');
    }
  };

  return (
    <Mylayout title={isRTL ? "جميع المنتجات" : "All Products"}>
      <div className="container mt-4">
        {/* Page Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 mb-3" style={{
            background: 'linear-gradient(135deg, #4A90E2, #FF6B6B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            fontWeight: 'bold'
          }}>
            {isRTL ? "جميع المنتجات" : "All Products"}
          </h1>
          <p className="lead text-muted">
            {isRTL ? "تصفح مجموعتنا الكاملة من المنتجات عالية الجودة" : "Browse our complete collection of high-quality products"}
          </p>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border spinner-border-lg" role="status" style={{ color: '#4A90E2' }}>
              <span className="visually-hidden">{isRTL ? "جاري التحميل..." : "Loading..."}</span>
            </div>
            <p className="mt-3 text-muted">{isRTL ? "جاري تحميل المنتجات..." : "Loading products..."}</p>
          </div>
        ) : (
          <>
            {/* Products Count */}
            <div className="mb-4">
              <p className="text-muted h6">
                {isRTL ? `إجمالي المنتجات: ${products.length}` : `Total Products: ${products.length}`}
              </p>
            </div>

            {/* Products Grid */}
            <div className="row">
              {products.length > 0 ? products.map(product => (
                <div key={product._id} className="col-lg-3 col-md-4 col-6 mb-4">
                  <div className="product-card h-100">
                  <div className="product-image-container">
                    <img
                      src={getProductPhotoUrl(product._id)}
                      alt={product.name}
                      className="product-image"
                      onClick={() => navigate(`/product/${product._id}`)}
                      style={{ cursor: 'pointer' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x200/4A90E2/FFFFFF?text=' + encodeURIComponent(product.name);
                      }}
                    />
                  </div>
                  
                  <div className="product-info">
                    <h5 className="product-name">{product.name}</h5>
                    <p className="product-description">
                      {product.description.length > 100 
                        ? `${product.description.substring(0, 100)}...` 
                        : product.description
                      }
                    </p>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h6 className="product-price mb-0">
                        {isRTL ? `${product.price} جنيه` : `$${product.price}`}
                      </h6>
                      <span className="badge bg-success">
                        {isRTL ? "متوفر" : "In Stock"}
                      </span>
                    </div>
                  </div>

                  <div className="product-buttons">
                    <div className="d-flex gap-2 w-100">
                      <button
                        className="btn btn-primary flex-fill"
                        onClick={() => addToCart(product)}
                      >
                        <i className="fas fa-shopping-cart me-2"></i>
                        {isRTL ? "أضف للسلة" : "Add to Cart"}
                      </button>
                      <button
                        className="btn btn-outline-primary"
                        onClick={() => navigate(`/product/${product._id}`)}
                      >
                        <i className="fas fa-eye"></i>
                      </button>
                    </div>
                  </div>
                  </div>
                </div>
              )) : (
                <div className="col-12 text-center py-5">
                  <div className="alert alert-info border-0 shadow-sm" style={{
                    background: 'linear-gradient(135deg, #e3f2fd, #f0f8ff)',
                    borderRadius: '20px'
                  }}>
                    <i className="fas fa-info-circle mb-3" style={{ fontSize: '3rem', color: '#4A90E2' }}></i>
                    <h4 className="mb-3">{isRTL ? "لا توجد منتجات" : "No Products Available"}</h4>
                    <p className="mb-4">
                      {isRTL ? 'لا توجد منتجات متاحة حالياً. يرجى المحاولة مرة أخرى لاحقاً.' : 'No products are currently available. Please try again later.'}
                    </p>
                    <button
                      className="btn btn-primary"
                      onClick={() => getAllProducts()}
                      style={{ borderRadius: '25px', padding: '12px 30px' }}
                    >
                      <i className="fas fa-refresh me-2"></i>
                      {isRTL ? 'إعادة المحاولة' : 'Retry'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Mylayout>
  );
};

export default AllProducts;
