import React from 'react'
import {Link} from "react-router-dom"
import { useTranslation } from 'react-i18next';

const Myfooter = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const openWhatsApp = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    const message = isRTL ? 'مرحباً، أود الاستفسار عن منتجاتكم' : 'Hello, I would like to inquire about your products';
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <footer className='modern-footer'>
      <div className='footer-main'>
        <div className='container-fluid'>
          <div className='row'>
            {/* Company Info */}
            <div className='col-lg-4 col-md-6 mb-4'>
              <div className='footer-section'>
                <div className='footer-title-wrapper'>
                  <div className='title-line'></div>
                  <h5 className='footer-title'>
                    <i className="fas fa-store me-2"></i>
                    {isRTL ? 'متجرنا' : 'Our Store'}
                  </h5>
                </div>
                <p className='footer-text'>
                  {isRTL ? 
                    'نحن نقدم أفضل المنتجات عالية الجودة مع خدمة توصيل سريعة وموثوقة لجميع عملائنا الكرام.' :
                    'We provide the best high-quality products with fast and reliable delivery service for all our valued customers.'
                  }
                </p>
                <div className='social-links'>
                  <a href="#" className='social-link facebook' aria-label="Facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a href="#" className='social-link instagram' aria-label="Instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="#" className='social-link twitter' aria-label="Twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="#" className='social-link youtube' aria-label="YouTube">
                    <i className="fab fa-youtube"></i>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className='col-lg-2 col-md-6 mb-4'>
              <div className='footer-section'>
                <div className='footer-title-wrapper'>
                  <div className='title-line'></div>
                  <h5 className='footer-title'>
                    <i className="fas fa-link me-2"></i>
                    {isRTL ? 'روابط سريعة' : 'Quick Links'}
                  </h5>
                </div>
                <ul className='footer-links'>
                  <li><Link to="/">{isRTL ? 'الرئيسية' : 'Home'}</Link></li>
                  <li><Link to="/products">{isRTL ? 'جميع المنتجات' : 'All Products'}</Link></li>
                  <li><Link to="/aboutus">{isRTL ? 'من نحن' : 'About Us'}</Link></li>
                  <li><Link to="/contactus">{isRTL ? 'اتصل بنا' : 'Contact Us'}</Link></li>
                  <li><Link to="/policy">{isRTL ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link></li>
                </ul>
              </div>
            </div>

            {/* Customer Service */}
            <div className='col-lg-3 col-md-6 mb-4'>
              <div className='footer-section'>
                <div className='footer-title-wrapper'>
                  <div className='title-line'></div>
                  <h5 className='footer-title'>
                    <i className="fas fa-headset me-2"></i>
                    {isRTL ? 'خدمة العملاء' : 'Customer Service'}
                  </h5>
                </div>
                <ul className='footer-links'>
                  <li><Link to="/cart">{isRTL ? 'سلة التسوق' : 'Shopping Cart'}</Link></li>
                  <li><Link to="/dashboard/user/orders">{isRTL ? 'طلباتي' : 'My Orders'}</Link></li>
                  <li><Link to="/dashboard/user/profile">{isRTL ? 'حسابي' : 'My Account'}</Link></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); alert(isRTL ? 'قريباً...' : 'Coming soon...'); }}>
                    {isRTL ? 'الأسئلة الشائعة' : 'FAQ'}
                  </a></li>
                  <li><a href="#" onClick={(e) => { e.preventDefault(); alert(isRTL ? 'قريباً...' : 'Coming soon...'); }}>
                    {isRTL ? 'سياسة الإرجاع' : 'Return Policy'}
                  </a></li>
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className='col-lg-3 col-md-6 mb-4'>
              <div className='footer-section'>
                <div className='footer-title-wrapper'>
                  <div className='title-line'></div>
                  <h5 className='footer-title'>
                    <i className="fas fa-phone me-2"></i>
                    {isRTL ? 'اتصل بنا' : 'Contact Us'}
                  </h5>
                </div>
                <div className='contact-info'>
                  <div className='contact-item'>
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{isRTL ? 'التجمع الخامس -القاهره' : 'New Cairo - cairo'}</span>
                  </div>
                  <div className='contact-item'>
                    <i className="fab fa-facebook-f"></i>
                    <a href="https://www.facebook.com/shopeklopek" target="_blank" rel="noopener noreferrer">
                      /shopaiklopaik
                    </a>
                  </div>
                  <div className='contact-item whatsapp-contact'>
                    <i className="fab fa-whatsapp"></i>
                    <button 
                      className='whatsapp-btn'
                      onClick={() => openWhatsApp('+201007150979')}
                      aria-label="Contact us on WhatsApp"
                    >
                      01007150979
                    </button>
                  </div>
                  <div className='contact-item whatsapp-contact'>
                    <i className="fab fa-whatsapp"></i>
                    <button 
                      className='whatsapp-btn'
                      onClick={() => openWhatsApp('+201110094702')}
                      aria-label="Contact us on WhatsApp"
                    >
                      01110094702
                    </button>
                  </div>
                  <div className='contact-item'>
                    <i className="fas fa-clock"></i>
                    <span>{isRTL ? '24/7 متاح' : '24/7 Available'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className='footer-bottom'>
        <div className='container-fluid'>
          <div className='row align-items-center'>
            <div className='col-md-6'>
              <p className='copyright-text'>
                © 2024 {isRTL ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'} - 
                <span className='brand-name'> Shopaik lopaik</span>
              </p>
            </div>
            <div className='col-md-6'>
              <div className='payment-methods'>
                <span className='payment-text'>{isRTL ? 'نقبل:' : 'We Accept:'}</span>
                <i className="fab fa-cc-visa"></i>
                <i className="fab fa-cc-mastercard"></i>
                <i className="fab fa-cc-paypal"></i>
                <i className="fas fa-money-bill-wave"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Background Animation */}
      <div className='footer-bg-animation'>
        <div className='wave wave1'></div>
        <div className='wave wave2'></div>
        <div className='wave wave3'></div>
      </div>
    </footer>
  )
}

export default Myfooter