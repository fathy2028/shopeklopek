import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js"; // Import the product model
import fs from "fs";

export const createCategoryController = async (req, res) => {
    try {
        const { name, deliveryDuration } = req.fields;
        const { photo } = req.files;

        if (!name) {
            return res.status(401).send({ message: "Name is required" });
        }
        if (!deliveryDuration || deliveryDuration < 30 || deliveryDuration > 10080) {
            return res.status(401).send({ message: "Delivery duration is required and must be between 30 and 10080 minutes" });
        }

        const existcategory = await categoryModel.findOne({ name });
        if (existcategory) {
            return res.status(200).send({
                success: true,
                message: "Category already exists"
            });
        }

        const category = new categoryModel({
            name,
            slug: slugify(name),
            deliveryDuration
        });

        if (photo) {
            category.photo.data = fs.readFileSync(photo.path);
            category.photo.contentType = photo.type;
        }

        await category.save();
        res.status(201).send({
            success: true,
            message: "Category created successfully",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in creating category",
            error
        });
    }
};

export const updateCategoryController = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, deliveryDuration } = req.fields;
        const { photo } = req.files;

        if (!name) {
            return res.status(400).send({
                success: false,
                message: "Name is required"
            });
        }

        const updateData = { name, slug: slugify(name) };

        // Only update delivery duration if provided
        if (deliveryDuration !== undefined) {
            if (deliveryDuration < 30 || deliveryDuration > 10080) {
                return res.status(400).send({
                    success: false,
                    message: "Delivery duration must be between 30 and 10080 minutes"
                });
            }
            updateData.deliveryDuration = deliveryDuration;
        }

        // Handle photo update
        if (photo) {
            updateData.photo = {
                data: fs.readFileSync(photo.path),
                contentType: photo.type
            };
        }

        const category = await categoryModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Category updated successfully",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while updating the category",
            error
        });
    }
};

export const getCategoriesController = async (req, res) => {
    try {
        console.log("Fetching categories...");

        // Check database connection
        if (!categoryModel.db.readyState) {
            console.error("Database not connected");
            return res.status(500).send({
                success: false,
                message: "Database connection error",
                categories: []
            });
        }

        const categories = await categoryModel.find().select("-photo");
        console.log("Categories found:", categories ? categories.length : 0);

        // Handle empty or null categories
        if (!categories) {
            console.log("No categories found in database");
            return res.status(200).send({
                success: true,
                message: "No categories found",
                categories: []
            });
        }

        // Ensure categories is always an array and add default deliveryDuration if missing
        const categoriesArray = Array.isArray(categories) ? categories.map(category => {
            const categoryObj = category.toObject ? category.toObject() : category;
            return {
                ...categoryObj,
                deliveryDuration: categoryObj.deliveryDuration || 1440 // Default to 24 hours if missing
            };
        }) : [];

        console.log("Processed categories:", categoriesArray.length);

        res.status(200).send({
            success: true,
            message: categoriesArray.length > 0 ? "Categories fetched successfully" : "No categories found",
            categories: categoriesArray
        });
    } catch (error) {
        console.error("Error in getCategoriesController:", error);
        console.error("Error stack:", error.stack);
        res.status(500).send({
            success: false,
            message: "Error in fetching categories",
            error: error.message,
            categories: []
        });
    }
};

export const getCategoryController = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await categoryModel.findById(id);
        res.status(200).send({
            success: true,
            message: "Category fetched successfully",
            category
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in fetching this category",
            error
        });
    }
};

export const deleteCategoryController = async (req, res) => {
    try {
        const id = req.params.id;

        // Delete all products related to the category
        await productModel.deleteMany({ category: id });

        // Delete the category
        await categoryModel.findByIdAndDelete(id);

        res.status(200).send({
            success: true,
            message: "Category and related products deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Failed to delete category and related products",
            error
        });
    }
};

// Get category photo
export const getCategoryPhotoController = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id).select("photo");
        if (category.photo.data) {
            res.set("Content-type", category.photo.contentType);
            return res.status(200).send(category.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting category photo",
            error
        });
    }
};
