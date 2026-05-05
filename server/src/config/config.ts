import dotenv from "dotenv";

dotenv.config();

export const config = {
    port: process.env.PORT || 5000,
    mongoUri: process.env.MONGO_URI as string,
    jwtSecret: process.env.JWT_SECRET as string,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN as string,
    imageKitPublicKey: process.env.IMAGEKIT_PUBLIC_KEY as string,
    imageKitPrivateKey: process.env.IMAGEKIT_PRIVATE_KEY as string,
    imageKitUrlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT as string,
};

