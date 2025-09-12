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

    // Quantity options for dropdown
    const getQuantityOptions = () => {
        return [
            { value: 0.25, label: isRTL ? 'ربع كيلو' : '0.25 kg' },
            { value: 0.5, label: isRTL ? 'نصف كيلو' : '0.5 kg' },
            { value: 0.75, label: isRTL ? 'ثلاثة أرباع كيلو' : '0.75 kg' },
            { value: 1, label: isRTL ? 'كيلو واحد' : '1 kg' },
            { value: 1.25, label: isRTL ? 'كيلو وربع' : '1.25 kg' },
            { value: 1.5, label: isRTL ? 'كيلو ونصف' : '1.5 kg' },
            { value: 1.75, label: isRTL ? 'كيلو وثلاثة أرباع' : '1.75 kg' },
            { value: 2, label: isRTL ? 'كيلو' : '2 kg' },
            { value: 2.5, label: isRTL ? 'كيلو ونصف' : '2.5 kg' },
            { value: 3, label: isRTL ? 'كيلو' : '3 kg' },
            { value: 4, label: isRTL ? 'كيلو' : '4 kg' },
            { value: 5, label: isRTL ? 'كيلو' : '5 kg' }
        ];
    };

    // Update product quantity in cart
    const updateProductQuantity = (productId, newQuantity) => {
        try {
            // Find the product in cart
            const productIndex = cart.findIndex(item => item._id === productId);
            
            if (productIndex === -1) {
                console.error('Product not found in cart');
                return;
            }

            // Create new cart with updated quantity
            let newCart = [...cart];
            newCart[productIndex] = {
                ...newCart[productIndex],
                quantity: newQuantity
            };

            setCart(newCart);
            localStorage.setItem("cart", JSON.stringify(newCart));
            toast.success(isRTL ? "تم تحديث الكمية بنجاح" : "Quantity updated successfully");
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
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

    const deliveryFee = 25; // Delivery fee in EGP

    const getSubtotal = () => {
        try {
            let total = 0;
            cart?.forEach(item => { 
                const quantity = item.quantity || 1;
                total += item.price * quantity; 
            });
            return Math.round(total * 100) / 100; // Round to 2 decimal places
        } catch (error) {
            console.log(error);
            return 0;
        }
    };

    const getTotalPrice = () => {
        try {
            const subtotal = getSubtotal();
            const total = subtotal + (cart.length > 0 ? deliveryFee : 0);
            return Math.round(total * 100) / 100; // Round to 2 decimal places
        } catch (error) {
            console.log(error);
            return 0;
        }
    };

    const formatPrice = (price) => {
        return isRTL ? `${price} ${currency}` : `${currency} ${price}`;
    };

    const getProductCount = (id) => {
        const product = cart.find(item => item._id === id);
        return product ? (product.quantity || 1) : 1;
    };

    // Calculate total price for a specific product (price * quantity)
    const getItemTotalPrice = (product) => {
        const quantity = product.quantity || 1;
        const total = parseFloat(product.price) * parseFloat(quantity);
        return Math.round(total * 100) / 100;
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
            const totalcash = getTotalPrice(); // Include delivery fees in the order total

            // Create quantities array with productId and quantity for each unique product
            const quantities = uniqueProducts.map(product => ({
                productId: product._id,
                quantity: getProductCount(product._id)
            }));

            const orderData = {
                products: cart.map(item => item._id),
                quantities: quantities,
                totalcash,
                deliveryFee: deliveryFee
            };

            console.log('Order data being sent:', orderData);
            console.log('Cart:', cart);
            console.log('Unique products:', uniqueProducts);
            console.log('Quantities:', quantities);

            const { data } = await axios.post(`${backendUrl}/api/v1/order/create`, orderData, {
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
            console.log('Order creation error:', error);
            console.log('Error response:', error.response?.data);
            console.log('Error status:', error.response?.status);
            
            const errorMessage = error.response?.data?.message || "Failed to place the order";
            toast.error(isRTL ? "فشل في تأكيد الطلب" : errorMessage);
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
                                    `لديك ${cart?.length} منتج في سلتك ${auth?.token ? "" : "يرجى تسجيل الدخول لتاكيد الاوردر"}` :
                                    `You have ${cart?.length} Products in Your Cart ${auth?.token ? "" : "Please Login to confirm the order"}`
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
                                    <div className="mb-2">
                                        <h5 className="text-muted mb-1">
                                            {isRTL ? 'سعر الوحدة:' : 'Unit Price:'} {formatPrice(p.price)}
                                        </h5>
                                        <h3 className="text-primary">
                                            {isRTL ? (
                                                <><b>{getItemTotalPrice(p)}</b> {currency}</>
                                            ) : (
                                                <><b>{currency}</b> {getItemTotalPrice(p)}</>
                                            )}
                                        </h3>
                                        <small className="text-muted">
                                            {isRTL ? 
                                                `(${p.quantity || 1} × ${p.price} = ${getItemTotalPrice(p)})` :
                                                `(${p.quantity || 1} × ${p.price} = ${getItemTotalPrice(p)})`
                                            }
                                        </small>
                                    </div>
                                    
                                    <div className='d-flex align-items-center mb-2'>
                                        <label className='me-2' style={{ fontWeight: 'bold', minWidth: '80px' }}>
                                            {isRTL ? 'الكمية:' : 'Quantity:'}
                                        </label>
                                        <select 
                                            className='form-select me-2' 
                                            style={{ 
                                                width: '150px',
                                                borderRadius: '8px',
                                                border: '2px solid #e9ecef',
                                                fontSize: '0.9rem'
                                            }}
                                            value={getProductCount(p._id)}
                                            onChange={(e) => {
                                                const newQuantity = parseFloat(e.target.value);
                                                if (!isNaN(newQuantity)) {
                                                    updateProductQuantity(p._id, newQuantity);
                                                }
                                            }}
                                        >
                                            {getQuantityOptions().map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    
                                    <div className='d-flex align-items-center'>
                                        <button className='btn btn-danger' onClick={() => removeCartItem(p._id)}>
                                            <i className="fa fa-trash me-1"></i>
                                            {isRTL ? 'حذف' : 'Remove'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className='col-md-4 text-center'>
                        <div className="cart-summary-card" style={{
                            background: 'linear-gradient(135deg, #f8f9fa, #e9ecef)',
                            borderRadius: '20px',
                            padding: '30px',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.1)',
                            border: '1px solid #dee2e6'
                        }}>
                            <h2 className="mb-3" style={{
                                background: 'linear-gradient(135deg, #4A90E2, #FF6B6B)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                                fontWeight: 'bold'
                            }}>
                                {isRTL ? 'ملخص السلة' : 'Cart Summary'}
                            </h2>
                            <h6 className="text-muted mb-4">
                                {isRTL ? 'المجموع | الدفع | الطريقة' : 'Total | CheckOut | Payment'}
                            </h6>
                            <hr style={{ margin: '20px 0', border: '1px solid #dee2e6' }} />
                            
                            {/* Order Summary */}
                            <div className="order-breakdown mb-4">
                                {cart.length > 0 && (
                                    <>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>{isRTL ? 'المجموع الفرعي:' : 'Subtotal:'}</span>
                                            <span className="fw-bold">{formatPrice(getSubtotal())}</span>
                                        </div>
                                        <div className="d-flex justify-content-between mb-2">
                                            <span>{isRTL ? 'رسوم التوصيل:' : 'Delivery Fee:'}</span>
                                            <span className="fw-bold text-info">{formatPrice(deliveryFee)}</span>
                                        </div>
                                        <hr style={{ margin: '15px 0' }} />
                                    </>
                                )}
                                <div className="d-flex justify-content-between">
                                    <span className="fs-5 fw-bold">{isRTL ? 'الإجمالي:' : 'Total:'}</span>
                                    <span className="fs-5 fw-bold" style={{
                                        background: 'linear-gradient(135deg, #4A90E2, #FF6B6B)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text'
                                    }}>
                                        {formatPrice(getTotalPrice())}
                                    </span>
                                </div>
                            </div>

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
                                    <button 
                                        className='btn btn-success w-100' 
                                        onClick={placeOrder}
                                        style={{
                                            borderRadius: '25px',
                                            padding: '15px 30px',
                                            fontSize: '1.1rem',
                                            fontWeight: '600',
                                            background: 'linear-gradient(135deg, #28a745, #20c997)',
                                            border: 'none',
                                            boxShadow: '0 8px 25px rgba(40, 167, 69, 0.3)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseOver={(e) => {
                                            e.target.style.transform = 'translateY(-2px)';
                                            e.target.style.boxShadow = '0 12px 35px rgba(40, 167, 69, 0.4)';
                                        }}
                                        onMouseOut={(e) => {
                                            e.target.style.transform = 'translateY(0)';
                                            e.target.style.boxShadow = '0 8px 25px rgba(40, 167, 69, 0.3)';
                                        }}
                                    >
                                        <i className="fas fa-check-circle me-2"></i>
                                        {isRTL ? 'تأكيد الطلب' : 'Place Order'}
                                    </button>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Mylayout>
    );
};

export default CartPage;
