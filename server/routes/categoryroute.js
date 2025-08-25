import express from "express"
import { isadmin, requiredsignin } from "../middlewares/authMiddleware.js";
import { createCategoryController, deleteCategoryController, getCategoriesController, getCategoryController, updateCategoryController, getCategoryPhotoController } from "../controllers/categoryController.js";
import formidable from "express-formidable";

const router=express.Router();

router.post("/create-category",requiredsignin,isadmin,formidable(),createCategoryController)

router.put("/update-category/:id",requiredsignin,isadmin,formidable(),updateCategoryController)

router.get("/getcategories",getCategoriesController)

router.get("/getcategory/:id",getCategoryController)

router.get("/get-category-photo/:id",getCategoryPhotoController)

router.delete("/deletecategory/:id",requiredsignin,isadmin,deleteCategoryController)


export default router;