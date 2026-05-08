import ImageKit from "@imagekit/nodejs"
import { config } from "../config/config"

export const imageKit = new (ImageKit as any)({
    publicKey: config.imageKitPublicKey as string,
    privateKey: config.imageKitPrivateKey as string,
    urlEndpoint: config.imageKitUrlEndpoint as string
})
