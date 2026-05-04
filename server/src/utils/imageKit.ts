import ImageKit from "@imagekit/nodejs"
import { config } from "../config/config"

export const imageKit = new ImageKit({
    publicKey: config.imageKitPublicKey,
    privateKey: config.imageKitPrivateKey,
    urlEndpoint: config.imageKitUrlEndpoint
})
