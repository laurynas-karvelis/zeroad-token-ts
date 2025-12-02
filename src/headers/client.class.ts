import { CLIENT_HEADERS, ClientHeaderParseResult, PROTOCOL_VERSION, FEATURES } from "../constants";
import { fromBase64, getSiteFeaturesNative, hasFeature, setFeatures, toBase64 } from "../helpers";
import { importPrivateKey, importPublicKey, KeyObject, nonce, sign, verify } from "../native.crypto";
import { log } from "../logger";

const VERSION_BYTES = 1;
const NONCE_BYTES = 4;
const SEPARATOR = ".";

const SITE_FEATURES_NATIVE = getSiteFeaturesNative();

const as32BitNumber = (byteArray: Uint8Array, begin: number) => {
  const bytes = byteArray.subarray(begin, begin + Uint32Array.BYTES_PER_ELEMENT);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  return view.getUint32(0, true);
};

export class ClientHeader {
  private cryptoPublicKey: KeyObject | undefined;
  private cryptoPrivateKey: KeyObject | undefined;

  private publicKey;
  private privateKey;

  NAME = CLIENT_HEADERS.HELLO.toLowerCase();

  constructor(publicKey: string, privateKey?: string) {
    this.publicKey = publicKey;
    this.privateKey = privateKey;
  }

  parseToken(headerValue: string | string[] | undefined) {
    const headerValueAsString = Array.isArray(headerValue) ? headerValue[0] : headerValue;
    const data = this.decode(headerValueAsString);

    const expired = !data || data.expiresAt.getTime() < Date.now();
    const result: Partial<Record<keyof typeof FEATURES, boolean>> = {};

    if (!data || expired) {
      for (const [feature] of SITE_FEATURES_NATIVE) {
        result[feature] = false;
      }

      return result as Record<keyof typeof FEATURES, boolean>;
    }

    for (const [feature, shift] of SITE_FEATURES_NATIVE) {
      result[feature] = hasFeature(data.flags, shift);
    }

    return result as Record<keyof typeof FEATURES, boolean>;
  }

  decode(headerValue: string | undefined): ClientHeaderParseResult {
    if (!headerValue?.length) return;
    if (!this.cryptoPublicKey) this.cryptoPublicKey = importPublicKey(this.publicKey);

    try {
      const [data, signature] = headerValue.split(SEPARATOR);
      const dataBytes = fromBase64(data);
      const signatureBytes = fromBase64(signature);

      if (!verify(dataBytes.buffer as ArrayBuffer, signatureBytes.buffer as ArrayBuffer, this.cryptoPublicKey)) {
        throw new Error("Forged header value is provided");
      }

      const version = dataBytes[0];

      if (version === PROTOCOL_VERSION.V_1) {
        const expiresAt = as32BitNumber(dataBytes, VERSION_BYTES + NONCE_BYTES);
        const flags = as32BitNumber(dataBytes, dataBytes.length - Uint32Array.BYTES_PER_ELEMENT);

        return { version, expiresAt: new Date(expiresAt * 1000), flags };
      }
    } catch (err) {
      log("warn", "Could not decode client header value", { reason: (err as Error)?.message });
    }
  }

  encode(version: PROTOCOL_VERSION, expiresAt: Date, features: FEATURES[]) {
    if (!this.privateKey) throw new Error("Private key is required");

    const data = mergeByteArrays([
      new Uint8Array([version]),
      new Uint8Array(nonce(NONCE_BYTES)),
      new Uint32Array([Math.floor(expiresAt.getTime() / 1000)]),
      new Uint32Array([setFeatures(0, features)]),
    ]);

    if (!this.cryptoPrivateKey) this.cryptoPrivateKey = importPrivateKey(this.privateKey);
    const signature = sign(data.buffer, this.cryptoPrivateKey);

    return [toBase64(data), toBase64(new Uint8Array(signature))].join(SEPARATOR);
  }
}

const mergeByteArrays = (arrays: (Uint8Array | Uint32Array)[]) => {
  const totalLength = arrays.reduce((sum, a) => sum + a.byteLength, 0);
  const data = new Uint8Array(totalLength);

  let offset = 0;
  for (const arr of arrays) {
    let bytes: Uint8Array;

    if (arr instanceof Uint8Array) bytes = arr;
    else if (arr instanceof Uint32Array) bytes = new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
    else throw new Error("Unsupported type");

    data.set(bytes, offset);
    offset += bytes.byteLength;
  }

  return data;
};
