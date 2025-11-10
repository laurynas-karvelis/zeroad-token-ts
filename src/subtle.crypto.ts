import { cryptoUniversal } from "./crypto";
import { fromBase64, toBase64 } from "./helpers";

const { subtle, getRandomValues } = cryptoUniversal;

const algorithm = { name: "Ed25519" };

export async function generateKeys() {
  const { privateKey, publicKey } = (await subtle.generateKey(algorithm, true, [
    "sign",
    "verify",
  ])) as unknown as CryptoKeyPair;

  return {
    privateKey: toBase64(new Uint8Array(await subtle.exportKey("pkcs8", privateKey))),
    publicKey: toBase64(new Uint8Array(await subtle.exportKey("spki", publicKey))),
  };
}

export const importPrivateKey = (privateKey: string) =>
  subtle.importKey("pkcs8", fromBase64(privateKey), algorithm, false, ["sign"]);

export const importPublicKey = (publicKey: string) =>
  subtle.importKey("spki", fromBase64(publicKey), algorithm, false, ["verify"]);

export const sign = (data: ArrayBuffer, privateKey: CryptoKey) => subtle.sign(algorithm, privateKey, data);

export const verify = (data: ArrayBuffer, signature: ArrayBuffer, publicKey: CryptoKey) =>
  subtle.verify(algorithm, publicKey, signature, data);

export const nonce = (byteCount: number) => {
  const bytes = new Uint8Array(byteCount);
  getRandomValues(bytes);
  return bytes;
};
