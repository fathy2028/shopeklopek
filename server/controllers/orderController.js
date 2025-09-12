import orderModel from '../models/orderModel.js';
import productModel from '../models/productModel.js';
import categoryModel from '../models/categoryModel.js';

// Create order
export const createOrderController = async (req, res) => {
    try {
        const { products, quantities, totalcash } = req.body;

        console.log('Order creation request received:');
        console.log('Products:', products);
        console.log('Quantities:', quantities);
        console.log('Total cash:', totalcash);

        // Validate that quantities array exists and is valid
        if (!quantities || !Array.isArray(quantities)) {
            console.log('Validation failed: Quantities array is missing or invalid');
            return res.status(400).send({
                success: false,
                message: 'Quantities array is required and must be an array'
            });
        }

        // Validate quantities array structure
        for (let i = 0; i < quantities.length; i++) {
            const qty = quantities[i];
            console.log(`Validating quantity ${i}:`, qty);
            
            if (!qty.productId || typeof qty.quantity !== 'number' || qty.quantity < 0) {
                console.log(`Validation failed for quantity ${i}:`, {
                    hasProductId: !!qty.productId,
                    quantityType: typeof qty.quantity,
                    quantityValue: qty.quantity
                });
                return res.status(400).send({
                    success: false,
                    message: `Invalid quantity structure at index ${i}. Each quantity must have productId and quantity >= 0`
                });
            }
        }

        // Get product details with categories to calculate delivery duration
        const productDetails = await productModel.find({ _id: { $in: products } }).populate('category');

        // Find the maximum delivery duration among all products (in minutes)
        let maxDeliveryDurationMinutes = 0;
        for (const product of productDetails) {
            if (product.category && product.category.deliveryDuration > maxDeliveryDurationMinutes) {
                maxDeliveryDurationMinutes = product.category.deliveryDuration;
            }
        }

        // If no delivery duration found, use default 24 hours (1440 minutes)
        if (maxDeliveryDurationMinutes === 0) {
            maxDeliveryDurationMinutes = 1440;
        }

        // Calculate estimated delivery date
        const estimatedDeliveryDate = new Date();
        const millisecondsToAdd = maxDeliveryDurationMinutes * 60 * 1000;
        estimatedDeliveryDate.setTime(estimatedDeliveryDate.getTime() + millisecondsToAdd);

        const newOrder = new orderModel({
            products,
            quantities,
            customer: req.user._id,
            totalcash,
            estimatedDeliveryDate,
            maxDeliveryDuration: maxDeliveryDurationMinutes // Store in minutes to match category model
        });
        await newOrder.save();
        res.status(201).send({
            success: true,
            message: 'Order created successfully',
            order: newOrder
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Failed to create order',
            error: error.message
        });
    }
};

// Get user orders
export const getUserOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({ customer: req.user._id })
            .populate({
                path: 'products',
                populate: {
                    path: 'category',
                    model: 'category'
                }
            })
            .populate({
                path: 'quantities.productId',
                populate: {
                    path: 'category',
                    model: 'category'
                }
            })
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error in fetching orders",
            error
        });
    }
};

// Get all orders (admin only)
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find()
            .populate({
                path: 'products',
                populate: {
                    path: 'category',
                    model: 'category'
                }
            })
            .populate({
                path: 'quantities.productId',
                populate: {
                    path: 'category',
                    model: 'category'
                }
            })
            .populate('customer')
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            orders
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Failed to get orders',
            error: error.message
        });
    }
};


// Update order status (admin only)
export const updateOrderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        // Update the order status
        const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true })
            .populate('products'); // Populate products to get product details

        if (!updatedOrder) {
            return res.status(404).send({
                success: false,
                message: 'Order not found'
            });
        }

        // If the order status is 'Delivered', decrease the quantity of the products
        if (status === 'Delivered') {
            const productCounts = updatedOrder.products.reduce((counts, product) => {
                counts[product._id] = (counts[product._id] || 0) + 1;
                return counts;
            }, {});

            for (const productId in productCounts) {
                const quantityToDecrement = productCounts[productId];

                // Decrease the quantity for the product in the database
                await productModel.findByIdAndUpdate(productId, {
                    $inc: { quantity: -quantityToDecrement }
                });
            }
        }

        res.status(200).send({
            success: true,
            message: 'Order status updated successfully',
            order: updatedOrder
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Failed to update order status',
            error: error.message
        });
    }
};
// Delete order (admin only)
export const deleteOrderController = async (req, res) => {
    try {
        const { orderId } = req.params;
        await orderModel.findByIdAndDelete(orderId);
        res.status(200).send({
            success: true,
            message: 'Order deleted successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Failed to delete order',
            error: error.message
        });
    }
};

export const deleteUserOrderController = async (req, res) => {
    try {
        const order = await orderModel.findOne({ _id: req.params.orderId, customer: req.user._id });
        if (!order) {
            return res.status(404).send({
                success: false,
                message: 'Order not found or not authorized to delete',
            });
        }
        await orderModel.findByIdAndDelete(req.params.orderId);
        res.status(200).send({
            success: true,
            message: 'Order deleted successfully',
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Failed to delete order',
            error: error.message,
        });
    }
}