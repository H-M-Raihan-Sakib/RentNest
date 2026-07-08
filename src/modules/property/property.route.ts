import { Router } from "express";
import { propertiesController } from "./property.controller.js";

const router = Router();

router.get("/", propertiesController.getAllProperties);
router.get("/categories", propertiesController.getAllPropertyCategories);
router.get("/:id", propertiesController.getPropertyDetails);

export const propertyRoutes = router;