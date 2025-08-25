import React from 'react';
import Mylayout from './../components/Layout/Mylayout';
import { useCart } from '../context/cart';
import { useAuth } from '../context/auth';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

const CartPage = () => {
    const [cart, setCart] = useCart();
    const [auth] = useAuth();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const backendUrl = process.env.BACKEND_URL || "https://shopeklopek-api.vercel.app";
    const isRTL = i18n.language === 'ar';
    const currency = i18n.language === 'ar' ? 'جنية' : 'EGP';

    const addToCart = (product) => {
        let newCart = [...cart];
        newCart.push(product);

        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        toast.success(isRTL ? "تم إضافة العنصر إلى السلة بنجاح" : "Item added to cart successfully");
    };

    const removeCartItem = (id) => {
        try {
            let newCart = [...cart];
            const productIndex = newCart.findIndex(item => item._id === id);

            if (productIndex > -1) {
                newCart.splice(productIndex, 1);
            }

            setCart(newCart);
            localStorage.setItem("cart", JSON.stringify(newCart));
            toast.success(isRTL ? "تم حذف العنصر من السلة بنجاح" : "Item removed successfully from your cart");
        } catch (error) {
            console.log(error);
            toast.error(isRTL ? "فشل في حذف العنصر من السلة" : "Failed to remove the item from the cart");
        }
    };

    const totalPrice = () => {
        try {
            let total = 0;
            cart?.forEach(item => { total += item.price; });
            return isRTL ? `${total} ${currency}` : `${currency} ${total}`;
        } catch (error) {
            console.log(error);
        }
    };

    const getProductCount = (id) => {
        return cart.filter(item => item._id === id).length;
    };

    const uniqueProducts = [...new Map(cart.map(item => [item._id, item])).values()];

    // Helper function to format duration from minutes to readable format
    const formatDuration = (minutes) => {
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
                return isRTL ? `${hours} ساعة و ${remainingMinutes} دقيقة` : `${hours} hours and ${remainingMinutes} minutes`;
            }
        } else {
            const days = Math.floor(minutes / 1440);
            const remainingHours = Math.floor((minutes % 1440) / 60);
            if (remainingHours === 0) {
                return isRTL ? `${days} يوم` : `${days} days`;
            } else {
                return isRTL ? `${days} يوم و ${remainingHours} ساعة` : `${days} days and ${remainingHours} hours`;
            }
        }
    };

    // Calculate estimated delivery information
    const getDeliveryInfo = () => {
        if (cart.length === 0) return null;

        let maxDeliveryDurationMinutes = 0;
        const categories = new Set();

        cart.forEach(item => {
            if (item.category && item.category.deliveryDuration) {
                // deliveryDuration is stored in minutes in the database
                const durationInMinutes = item.category.deliveryDuration;
                maxDeliveryDurationMinutes = Math.max(maxDeliveryDurationMinutes, durationInMinutes);
                categories.add(`${item.category.name} (${formatDuration(durationInMinutes)})`);
            }
        });

        // Default to 24 hours (1440 minutes) if no delivery duration found
        if (maxDeliveryDurationMinutes === 0) {
            maxDeliveryDurationMinutes = 1440;
        }

        const estimatedDeliveryDate = new Date();
        // More robust way to add minutes
        const millisecondsToAdd = maxDeliveryDurationMinutes * 60 * 1000;
        estimatedDeliveryDate.setTime(estimatedDeliveryDate.getTime() + millisecondsToAdd);

        return {
            maxDeliveryDurationMinutes,
            maxDeliveryDuration: formatDuration(maxDeliveryDurationMinutes), // Formatted string
            estimatedDeliveryDate,
            categories: Array.from(categories)
        };
    };

    const placeOrder = async () => {
        try {
            const totalcash = cart.reduce((total, item) => total + item.price, 0);

            const { data } = await axios.post(`${backendUrl}/api/v1/order/create`, {
                products: cart.map(item => item._id),
                totalcash
            }, {
                headers: {
                    Authorization: auth.token
                }
            });

            if (data.success) {
                setCart([]);
                localStorage.removeItem("cart");
                toast.success(isRTL ? "تم تأكيد الطلب بنجاح" : data.message);
                navigate('/dashboard/user/orders');
            } else {
                toast.error(isRTL ? "فشل في تأكيد الطلب" : data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(isRTL ? "فشل في تأكيد الطلب" : "Failed to place the order");
        }
    };

    // Function to get the URL for product photo
    const getProductPhotoUrl = (productId) => {
        return `${backendUrl}/api/v1/product/get-product-photo/${productId}`;
    };

    return (
        <Mylayout title={t('cart.title')}>
            <div className='container'>
                <div className='row'>
                    <div className='col-md-12'>
                        <h1 className='text-center bg-light p-2 mb-1'>
                            {isRTL ?
                                `مرحباً ${auth?.token && auth?.user?.name}` :
                                `Hello ${auth?.token && auth?.user?.name}`
                            }
                        </h1>
                        <h4 className='text-center'>
                            {cart?.length > 0 ?
                                (isRTL ?
                                    `لديك ${cart?.length} عناصر في سلتك ${auth?.token ? "" : "يرجى تسجيل الدخول للدفع"}` :
                                    `You have ${cart?.length} Items in Your Cart ${auth?.token ? "" : "Please Login to Checkout"}`
                                ) :
                                t('cart.emptyCart')
                            }
                        </h4>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-md-8'>
                        {uniqueProducts.map(p => (
                            <div key={p._id} className='row mb-2 card p-3 flex-row'>
                                <div className='col-md-4'>
                                    <img 
                                        style={{ objectFit: "fill" }} 
                                        width={"100px"} 
                                        height={"100px"} 
                                        src={getProductPhotoUrl(p._id)} 
                                        alt={p.name} 
                                        className='product-image' 
                                    />
                                </div>
                                <div className='col-md-8'>
                                    <h4>{p.name}</h4>
                                    <p>{p.description.substring(0, 30)}</p>
                                    <h3>
                                      {isRTL ? (
                                        <><b>{p.price}</b> {currency}</>
                                      ) : (
                                        <><b>{currency}</b> {p.price}</>
                                      )}
                                    </h3>
                                    <p>{isRTL ? `الكمية: ${getProductCount(p._id)}` : `Quantity: ${getProductCount(p._id)}`}</p>
                                    <div className='d-flex align-items-center'>
                                        <button className='btn btn-danger me-2' onClick={() => removeCartItem(p._id)}>
                                            <i className="fa fa-minus"></i>
                                        </button>
                                        <button className='btn btn-primary' onClick={() => addToCart(p)}>
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='col-md-4 text-center'>
                        <h2>{isRTL ? 'ملخص السلة' : 'Cart Summary'}</h2>
                        <h5>{isRTL ? 'المجموع | الدفع | الطريقة' : 'Total | CheckOut | Payment'}</h5>
                        <hr />
                        <h4>{isRTL ? `المجموع: ${totalPrice()}` : `Total: ${totalPrice()}`}</h4>

                        {/* Delivery Information */}
                        {cart.length > 0 && getDeliveryInfo() && (
                            <div className='mb-3 p-3 border rounded bg-light'>
                                <h5 className='text-primary'>
                                    {isRTL ? 'معلومات التسليم' : 'Delivery Information'}
                                </h5>
                                <p className='mb-2'>
                                    <strong>
                                        {isRTL ? 'التاريخ المتوقع للتسليم:' : 'Expected Delivery:'}
                                    </strong>
                                    <br />
                                    <span className='text-success'>
                                        {getDeliveryInfo().estimatedDeliveryDate.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </span>
                                </p>
                                <p className='mb-2'>
                                    <strong>
                                        {isRTL ? 'مدة التسليم القصوى:' : 'Max Delivery Duration:'}
                                    </strong>
                                    <br />
                                    <span className='text-info'>
                                        {getDeliveryInfo().maxDeliveryDuration}
                                    </span>
                                </p>
                                {getDeliveryInfo().categories.length > 0 && (
                                    <div>
                                        <strong>
                                            {isRTL ? 'الفئات:' : 'Categories:'}
                                        </strong>
                                        <br />
                                        {getDeliveryInfo().categories.map((cat, index) => (
                                            <span key={index} className='badge bg-secondary me-1 mb-1'>
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {
                            auth?.user?.address ? (
                                <>
                                    <div className='mb-3'>
                                        <h4>{isRTL ? 'العنوان الحالي' : 'Current Address'}</h4>
                                        <h5>{auth?.user?.address}</h5>
                                        <button className='btn btn-outline-warning' onClick={() => navigate("/dashboard/user/profile")}>
                                            {isRTL ? 'تحديث العنوان' : 'Update Address'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className='mb-3'>
                                    {
                                        auth?.token ? (
                                            <button className='btn btn-outline-warning' onClick={() => navigate("/dashboard/user/profile")}>
                                                {isRTL ? 'تحديث العنوان' : 'Update Address'}
                                            </button>
                                        ) : (
                                            <button className='btn btn-outline-warning' onClick={() => navigate("/login", { state: "/cart" })}>
                                                {isRTL ? 'يرجى تسجيل الدخول للدفع' : 'Please Login To CheckOut'}
                                            </button>
                                        )
                                    }
                                </div>
                            )
                        }
                        {
                            cart.length > 0 && auth?.token && (
                                <button className='btn btn-success' onClick={placeOrder}>
                                    {isRTL ? 'تأكيد الطلب' : 'Place Order'}
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </Mylayout>
    );
};

export default CartPage;
