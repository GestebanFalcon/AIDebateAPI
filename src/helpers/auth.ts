import crypto from "crypto";

export const generateKeyPair = () => new Promise<{publicKey: string, privateKey: string}>((resolve, reject) => {
    crypto.generateKeyPair("rsa", {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: "spki",
            format: "pem"
        },
        privateKeyEncoding: {
            type: "pkcs8",
            format: "pem"
        }
    }, (err: Error | null, publicKey: string, privateKey: string) => {
        err && reject(err);
        resolve({publicKey, privateKey});  
    });
});

export function jsonToBase64Url(json: Object) {
  const jsonString = JSON.stringify(json);
  const base64String = Buffer.from(jsonString).toString('base64');

  return base64String
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const base64UrlToJson = (base64Url: string) => {
    const base64StringUnpadded = base64Url
        .replace('-', '+')
        .replace('_', '/');
    const pad = 4 - (base64StringUnpadded.length % 4);
    const base64String = base64StringUnpadded  + '='.repeat(pad);

    const jsonString = Buffer.from(base64String, 'base64').toString();

    const json = JSON.parse(jsonString)
    return json;
}

export const encrypt = (privateKey: string, plaintext: string) => {
    try {
        const cipherBuffer = crypto.privateEncrypt(privateKey, plaintext)
        const ciphertext = cipherBuffer.toString('base64url');
        return { ciphertext };
    } catch (err) {
        return { error: "Unknown Encryption Error"};
    }
    
    
}

export const decrypt = (publicKey: string, ciphertext: string) => {
    const cipherBuffer = Buffer.from(ciphertext, 'base64url');
    try {
        const plaintext = crypto.publicDecrypt(publicKey, cipherBuffer).toString();
        return { plaintext };
    } catch (err) {
        return { error: "Invalid Ciphertext" };
    }
    
}

export const sha256 = (data: string) => {
    const hash = crypto.hash("sha256", data);
    return hash;
}



export type JwtPayloadData = {
    sub: string;
    email: string;
    iat: number;
    exp: number;
    role: "admin" | "user";
    aud: string;
}

export const generateDefaultTimestamps = (minuteCount: number) => {
    const iat = new Date();
    const iatTime = iat.getTime();
    const jwtTimeLength = minuteCount * 60 * 1000
    const exp = new Date(iatTime + (jwtTimeLength));
    return { iat, exp };
}

export const generateJwt = ({ data: { ...data }, keys }: { data: JwtPayloadData, keys?: { privateKey: string } }): { jwt: string, error?: undefined } | { error: string, jwt?: undefined } => {
    const header = {
        alg: "RSA",
        typ: "JWT"
    }

    const payload = {
        ...data,
    }

    const encodedHeader = jsonToBase64Url(header);
    const encodedPayload = jsonToBase64Url(payload);
    const signingInput = `${encodedHeader}.${encodedPayload}`
    
    const hashedSigningInput = sha256(signingInput);

    const privateKey = keys?.privateKey || process.env.JWT_PRIVATE_KEY;
    if (!privateKey) {
        return { error: "Unable to locate private key"};
    }
    
    const { ciphertext: signature, error } = encrypt(privateKey, hashedSigningInput);
    
    const jwt = `${signingInput}.${signature}`;
    return { jwt };
}

export const verifyJwt = (signingInput: string, signature: string) => {

    const publicKey = process.env.JWT_PUBLIC_KEY;

    if (!publicKey) {
        return ({ error: "Unable to locate public key", isVerified: false });
    }
    
    const { plaintext: decryptedSignature, error } = decrypt(publicKey, signature);

    if (!decryptedSignature) {
        return ({ error: error || "Unkown Decryption Error", isVerified: false });
    }

    const hashedSigningInput = sha256(signingInput);

    const isVerified = (hashedSigningInput === decryptedSignature);

    return { isVerified };
}
