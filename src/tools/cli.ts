import { generateKeys } from "./../subtle.crypto";

(async () => {
  const { privateKey, publicKey } = await generateKeys();

  console.info("Public Key:", publicKey);
  console.info("Private Key:", privateKey);
})();
