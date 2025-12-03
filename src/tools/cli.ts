import { generateKeys } from "../crypto";

const { privateKey, publicKey } = generateKeys();

console.info("Public Key:", publicKey);
console.info("Private Key:", privateKey);
