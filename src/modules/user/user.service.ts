import { prisma } from "../../lib/prisma.js";
import { ILoginPayload, IRegisterInfoPayload, IUpdateProfile } from "./user.interface.js"
import bcrypt from "bcryptjs";
import config from "../../config/index.js";
import { jwtUtils } from "../../utils/jwt.js";
import { SignOptions } from "jsonwebtoken";

const registerUser = async (payload: IRegisterInfoPayload) => {
    const { email, name, password, role } = payload;

    const isUserExist = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (isUserExist) {
        throw new Error("User with this email already exist !");
    }

    const hashedPassword = await bcrypt.hash(password, Number(config.bcrypt_salt_round))

    await prisma.user.create({
        data: {
            email: email,
            name: name,
            password: hashedPassword,
            role: role
        }
    })

    const user = await prisma.user.findFirstOrThrow({
        where: {
            email,
            name
        },
        omit: {
            password: true
        }
    })

    return user;
}

const loginUser = async (payload: ILoginPayload) => {
    const { email, password } = payload;

    const user = await prisma.user.findUniqueOrThrow({
        where: { email }
    })

    if (user.activeStatus === 'BLOCKED') {
        throw new Error("Your profile is blocked now. Please contact with support team.")
    }

    const isPasswordMatched = await bcrypt.compare(password, user.password);

    if (!isPasswordMatched) {
        throw new Error("Password is incorrect. Please enter correct passowrd.");
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email
    }

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions
    )

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions
    )

    return {
        accessToken, refreshToken
    }
}

const getMyInfo = async (userId: string) => {
    const userInfo = await prisma.user.findFirstOrThrow({
        where: {
            id: userId
        },
        omit: {
            password: true
        }
    })

    return userInfo;
}

const updateMyProfile = async (userId: string, payload: IUpdateProfile) => {

}

export const userServices = {
    registerUser,
    loginUser,
    getMyInfo,
    updateMyProfile
}