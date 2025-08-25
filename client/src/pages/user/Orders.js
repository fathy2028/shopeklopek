import React, { useEffect, useState } from 'react';
import Mylayout from '../../components/Layout/Mylayout';
import UserMenu from '../../components/Layout/UserMenu';
import { useAuth } from '../../context/auth';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const { t, i18n } = useTranslation();
  const backendUrl = process.env.BACKEND_URL || "https://shopeklopek-api.vercel.app";
  const isRTL = i18n.language === 'ar';
  const currency = i18n.language === 'ar' ? 'جنية' : 'EGP';

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/v1/order/user-orders`, {
          headers: {
            Authorization: auth.token
          }
        });
        if (data.success) {
          setOrders(data.orders);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch orders");
      }
    };

    if (auth?.token) {
      fetchOrders();
    }
  }, [auth, backendUrl]);

  const deleteOrder = async (orderId) => {
    try {
      const { data } = await axios.delete(`${backendUrl}/api/v1/order/user-order/${orderId}`, {
        headers: {
          Authorization: auth.token
        }
      });
      if (data.success) {
        toast.success('Order deleted successfully');
        setOrders(orders.filter(order => order._id !== orderId)); // Remove deleted order from state
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete order");
    }
  };

  // Function to get the URL for product photo
  const getProductPhotoUrl = (productId) => {
    return `${backendUrl}/api/v1/product/get-product-photo/${productId}`;
  };

  const formatDeliveryDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDeliveryStatus = (order) => {
    const now = new Date();
    const deliveryDate = new Date(order.estimatedDeliveryDate);

    if (order.status === 'Delivered') {
      return isRTL ? 'تم التسليم' : 'Delivered';
    } else if (order.status === 'Canceled') {
      return isRTL ? 'ملغي' : 'Canceled';
    } else if (now > deliveryDate) {
      return isRTL ? 'متأخر' : 'Delayed';
    } else {
      return isRTL ? 'في الوقت المحدد' : 'On Time';
    }
  };

  return (
    <Mylayout title={"Dashboard - Orders"}>
      <div className='container-fluid m-3 p-3'>
        <div className='row'>
          <div className='col-md-3'>
            <UserMenu />
          </div>
          <div className='col-md-9'>
            <h1>Orders</h1>
            {orders.length === 0 ? (
              <p>No orders found</p>
            ) : (
              orders.map(order => (
                <div key={order._id} className="card mb-3">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <div>
                      <span>
                        {isRTL ? `رقم الطلب: ${order._id}` : `Order ID: ${order._id}`}
                      </span>
                      <br />
                      <span className={`badge ${
                        order.status === 'Delivered' ? 'bg-success' :
                        order.status === 'Canceled' ? 'bg-danger' :
                        'bg-warning'
                      }`}>
                        {isRTL ?
                          (order.status === 'Not processed' ? 'لم يتم المعالجة' :
                           order.status === 'processing' ? 'قيد المعالجة' :
                           order.status === 'Shipped' ? 'تم الشحن' :
                           order.status === 'Out For Delivery' ? 'خارج للتسليم' :
                           order.status === 'Delivered' ? 'تم التسليم' :
                           order.status === 'Canceled' ? 'ملغي' : order.status) :
                          order.status
                        }
                      </span>
                    </div>
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteOrder(order._id)}
                    >
                      {isRTL ? 'حذف الطلب' : 'Delete Order'}
                    </button>
                  </div>
                  <div className="card-body">
                    {/* Delivery Information */}
                    <div className="row mb-3">
                      <div className="col-md-6">
                        <h6 className="text-primary">
                          {isRTL ? 'معلومات التسليم:' : 'Delivery Information:'}
                        </h6>
                        <p className="mb-1">
                          <strong>
                            {isRTL ? 'التاريخ المتوقع للتسليم:' : 'Expected Delivery:'}
                          </strong>
                          <br />
                          {order.estimatedDeliveryDate ?
                            formatDeliveryDate(order.estimatedDeliveryDate) :
                            (isRTL ? 'غير محدد' : 'Not specified')
                          }
                        </p>
                        <p className="mb-1">
                          <strong>
                            {isRTL ? 'مدة التسليم القصوى:' : 'Max Delivery Duration:'}
                          </strong>
                          <br />
                          {order.maxDeliveryDuration ?
                            (() => {
                              const minutes = order.maxDeliveryDuration;
                              if (minutes < 60) {
                                return isRTL ? `${minutes} دقيقة` : `${minutes} minutes`;
                              } else if (minutes === 60) {
                                return isRTL ? 'ساعة واحدة' : '1 hour';
                              } else if (minutes < 1440) {
                                const hours = Math.floor(minutes / 60);
                                const remainingMinutes = minutes % 60;
                                if (remainingMinutes === 0) {
                                  return isRTL ? `${hours} ساعة` : `${hours} hours`;
                                } else {
                                  return isRTL ? `${hours} ساعة و ${remainingMinutes} دقيقة` : `${hours}h ${remainingMinutes}m`;
                                }
                              } else {
                                const days = Math.floor(minutes / 1440);
                                const remainingHours = Math.floor((minutes % 1440) / 60);
                                return remainingHours === 0 ?
                                  (isRTL ? `${days} يوم` : `${days} days`) :
                                  (isRTL ? `${days} يوم و ${remainingHours} ساعة` : `${days}d ${remainingHours}h`);
                              }
                            })() :
                            (isRTL ? 'غير محدد' : 'Not specified')
                          }
                        </p>
                        <p className="mb-1">
                          <strong>
                            {isRTL ? 'حالة التسليم:' : 'Delivery Status:'}
                          </strong>
                          <br />
                          <span className={`badge ${
                            getDeliveryStatus(order).includes('Delivered') || getDeliveryStatus(order).includes('تم التسليم') ? 'bg-success' :
                            getDeliveryStatus(order).includes('Delayed') || getDeliveryStatus(order).includes('متأخر') ? 'bg-danger' :
                            getDeliveryStatus(order).includes('Canceled') || getDeliveryStatus(order).includes('ملغي') ? 'bg-secondary' :
                            'bg-info'
                          }`}>
                            {getDeliveryStatus(order)}
                          </span>
                        </p>
                      </div>
                      <div className="col-md-6">
                        <h6 className="text-success">
                          {isRTL ? 'إجمالي الطلب:' : 'Order Total:'}
                        </h6>
                        <h5>
                          {isRTL ? (
                            <>{order.totalcash} {currency}</>
                          ) : (
                            <>{currency} {order.totalcash}</>
                          )}
                        </h5>
                      </div>
                    </div>

                    {/* Products */}
                    <h6 className="text-info">
                      {isRTL ? 'المنتجات:' : 'Products:'}
                    </h6>
                    {order.products.map(product => (
                      <div key={product._id} className="row mb-2 border-bottom pb-2">
                        <div className="col-md-3">
                          <img
                            src={getProductPhotoUrl(product._id)}
                            alt={product.name}
                            width="80"
                            height="80"
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                          />
                        </div>
                        <div className="col-md-9">
                          <h6>{product.name}</h6>
                          <p className="text-muted small">{product.description}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span>
                              <strong>
                                {isRTL ? 'السعر:' : 'Price:'}
                              </strong>
                              {isRTL ? (
                                <> {product.price} {currency}</>
                              ) : (
                                <> {currency} {product.price}</>
                              )}
                            </span>
                            {product.category && (
                              <span className="badge bg-light text-dark">
                                {product.category.name}
                                {product.category.deliveryDuration && (
                                  <small className="text-muted">
                                    {' '}({product.category.deliveryDuration}h)
                                  </small>
                                )}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </Mylayout>
  );
};

export default Orders;
