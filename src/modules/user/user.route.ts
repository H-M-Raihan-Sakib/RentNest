import { Router } from "express";
import { userControllers } from "./user.controller.js";
import { auth } from "../../middleware/auth.js";
import { Role } from "../../../generated/prisma/enums.js";

const router = Router();

router.post("/register", userControllers.registerUser);
router.post("/login", userControllers.loginUser);
router.get(
    "/me",
    auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
    userControllers.getMyInfo
);
router.patch(
    "/my-profile",
    auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
    userControllers.updateMyProfile
)

router.put(
    "/my-profile",
    auth(Role.ADMIN, Role.LANDLORD, Role.TENANT),
    userControllers.updateMyProfile
)

export const userRoutes = router;