import React from "react";
import Layout from "./../components/Layout/Mylayout";
import { BiMailSend, BiPhoneCall } from "react-icons/bi";
import { useTranslation } from 'react-i18next';
import contact from "../images/contact.jpeg"

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const openWhatsApp = (phoneNumber) => {
    const cleanNumber = phoneNumber.replace(/\D/g, ''); // Remove non-digits
    const message = isRTL ? 'مرحباً، أود الاستفسار عن منتجاتكم' : 'Hello, I would like to inquire about your products';
    const url = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <Layout title={isRTL ? "اتصل بنا - متجرنا" : "Contact us - Our Store"}>
      <div className="row contactus">
        <div className="col-md-6">
          <img
            src={contact}
            alt="contactus"
            style={{ width: "100%", borderRadius: "15px", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
          />
        </div>
        <div className="col-md-6">
          <div className="contact-card" style={{
            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
            borderRadius: '20px',
            padding: '40px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
            height: '100%'
          }}>
            <h1 className="text-center mb-4" style={{
              background: 'linear-gradient(135deg, #4A90E2, #FF6B6B)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontWeight: 'bold',
              fontSize: '2.5rem'
            }}>
              {isRTL ? 'اتصل بنا' : 'CONTACT US'}
            </h1>
            
            <p className="text-center mb-4" style={{ 
              fontSize: '1.1rem', 
              color: '#6c757d', 
              lineHeight: '1.6' 
            }}>
              {isRTL ? 
                'لأي استفسار أو معلومات حول المنتجات، لا تتردد في الاتصال بنا في أي وقت. نحن متاحون 24/7' :
                'Any query and info about product feel free to call anytime we 24X7 available'
              }
            </p>

            <div className="contact-methods">
              <div className="contact-method-item mb-4" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                background: 'white',
                borderRadius: '15px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #25d366, #128c7e)',
                  padding: '15px',
                  borderRadius: '50%',
                  marginRight: isRTL ? '0' : '15px',
                  marginLeft: isRTL ? '15px' : '0'
                }}>
                  <i className="fab fa-whatsapp" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                </div>
                <div>
                  <p className="mb-1" style={{ fontWeight: '600', color: '#2c3e50' }}>
                    {isRTL ? 'واتساب:' : 'WhatsApp:'}
                  </p>
                  <button 
                    className="btn btn-outline-success"
                    onClick={() => openWhatsApp('+201007150979')}
                    style={{
                      borderRadius: '20px',
                      fontWeight: '600',
                      border: '2px solid #25d366',
                      color: '#25d366',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#25d366';
                      e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#25d366';
                    }}
                  >
                    01007150979
                  </button>
                </div>
              </div>

              <div className="contact-method-item mb-4" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                background: 'white',
                borderRadius: '15px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #25d366, #128c7e)',
                  padding: '15px',
                  borderRadius: '50%',
                  marginRight: isRTL ? '0' : '15px',
                  marginLeft: isRTL ? '15px' : '0'
                }}>
                  <i className="fab fa-whatsapp" style={{ color: 'white', fontSize: '1.5rem' }}></i>
                </div>
                <div>
                  <p className="mb-1" style={{ fontWeight: '600', color: '#2c3e50' }}>
                    {isRTL ? 'واتساب:' : 'WhatsApp:'}
                  </p>
                  <button 
                    className="btn btn-outline-success"
                    onClick={() => openWhatsApp('+201110094702')}
                    style={{
                      borderRadius: '20px',
                      fontWeight: '600',
                      border: '2px solid #25d366',
                      color: '#25d366',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.background = '#25d366';
                      e.target.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = '#25d366';
                    }}
                  >
                    01110094702
                  </button>
                </div>
              </div>

              <div className="contact-method-item" style={{
                display: 'flex',
                alignItems: 'center',
                padding: '15px',
                background: 'white',
                borderRadius: '15px',
                boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #4A90E2, #357ABD)',
                  padding: '15px',
                  borderRadius: '50%',
                  marginRight: isRTL ? '0' : '15px',
                  marginLeft: isRTL ? '15px' : '0'
                }}>
                  <BiMailSend style={{ color: 'white', fontSize: '1.5rem' }} />
                </div>
                <div>
                  <p className="mb-1" style={{ fontWeight: '600', color: '#2c3e50' }}>
                    {isRTL ? 'البريد الإلكتروني:' : 'Email:'}
                  </p>
                  <a 
                    href="mailto:info@shopeklopek.com"
                    style={{
                      color: '#4A90E2',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '1.1rem'
                    }}
                  >
                    info@shopeklopek.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
