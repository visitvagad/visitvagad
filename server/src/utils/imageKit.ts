import ImageKit from "@imagekit/nodejs"
import { config } from "../config/config"

export const imageKit = new ImageKit({
    publicKey: config.imageKitPublicKey as string,
    privateKey: config.imageKitPrivateKey as string,
    urlEndpoint: config.imageKitUrlEndpoint as string
} as any)
