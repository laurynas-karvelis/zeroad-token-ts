export interface UniversalCrypto {
  subtle: SubtleCrypto;
  getRandomValues<T extends ArrayBufferView<ArrayBufferLike>>(array: T): T;
}

export const cryptoUniversal: UniversalCrypto = (() => {
  let cryptoImpl: Crypto | undefined;

  // 1. Browser / Bun / Node 19+
  if (typeof globalThis !== "undefined" && globalThis.crypto?.subtle) {
    cryptoImpl = globalThis.crypto;
  }

  // 2. Node 18 (fallback)
  if (!cryptoImpl) {
    try {
      const { webcrypto } = require("crypto");
      cryptoImpl = webcrypto;
    } catch {
      /* ignore */
    }
  }

  if (!cryptoImpl) {
    throw new Error("WebCrypto API not available in this environment.");
  }

  // Bind methods so `this` is always correct
  const getRandomValues = cryptoImpl.getRandomValues.bind(cryptoImpl);

  return {
    subtle: cryptoImpl.subtle,
    getRandomValues,
  };
})();
