// Utility functions for delivery calculations

// Helper function to format duration from minutes to readable format
export const formatDuration = (minutes, isRTL = false) => {
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

export const calculateDeliveryInfo = (cart) => {
    if (!cart || cart.length === 0) return null;

    let maxDeliveryDurationMinutes = 0;
    const categories = new Set();

    cart.forEach(item => {
        if (item.category && item.category.deliveryDuration) {
            // deliveryDuration is stored in minutes in the database
            const durationInMinutes = item.category.deliveryDuration;
            maxDeliveryDurationMinutes = Math.max(maxDeliveryDurationMinutes, durationInMinutes);
            categories.add({
                name: item.category.name,
                duration: durationInMinutes
            });
        }
    });

    // Default to 24 hours (1440 minutes) if no delivery duration found
    if (maxDeliveryDurationMinutes === 0) {
        maxDeliveryDurationMinutes = 1440;
    }

    const estimatedDeliveryDate = new Date();
    estimatedDeliveryDate.setMinutes(estimatedDeliveryDate.getMinutes() + maxDeliveryDurationMinutes);

    return {
        maxDeliveryDurationMinutes,
        maxDeliveryDurationHours: Math.ceil(maxDeliveryDurationMinutes / 60), // For backward compatibility
        estimatedDeliveryDate,
        categories: Array.from(categories)
    };
};

export const formatDeliveryDate = (dateString, isRTL = false) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(isRTL ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

export const getDeliveryStatus = (order, isRTL = false) => {
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

export const getDeliveryStatusBadgeClass = (order) => {
    const status = getDeliveryStatus(order);
    
    if (status.includes('Delivered') || status.includes('تم التسليم')) {
        return 'bg-success';
    } else if (status.includes('Delayed') || status.includes('متأخر')) {
        return 'bg-danger';
    } else if (status.includes('Canceled') || status.includes('ملغي')) {
        return 'bg-secondary';
    } else {
        return 'bg-info';
    }
};
