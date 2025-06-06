import { describe, it, expect, beforeAll } from 'vitest';
import { 
  generateDefaultTimestamps, 
  generateJwt, 
  verifyJwt,
  generateKeyPair,
  type JwtPayloadData
} from "src/helpers/auth";

describe('JWT Helper Functions', () => {
  let testKeys: { publicKey: string, privateKey: string };

  beforeAll(async () => {
    testKeys = await generateKeyPair();
    process.env.JWT_PUBLIC_KEY = testKeys.publicKey;
    process.env.JWT_PRIVATE_KEY = testKeys.privateKey;
  });

  describe('generateDefaultTimestamps()', () => {
    it('should generate valid timestamps with correct duration', () => {
      const minuteCount = 0.25; // 15 minutes
      const { iat, exp } = generateDefaultTimestamps(minuteCount);
      
      expect(iat).toBeInstanceOf(Date);
      expect(exp).toBeInstanceOf(Date);
      expect(exp.getTime()).toBeGreaterThan(iat.getTime());
      expect(exp.getTime() - iat.getTime()).toBe(minuteCount * 60 * 1000);
    });

    it('should handle zero minutes correctly', () => {
      const { iat, exp } = generateDefaultTimestamps(0);
      expect(exp.getTime()).toBe(iat.getTime());
    });
  });

  describe('generateJwt()', () => {

    console.log("private key: " + process.env.JWT_PRIVATE_KEY);

    const testPayload: JwtPayloadData = {
      sub: "test-user",
      email: "test@example.com",
      iat: Date.now(),
      exp: Date.now() + 900000, // 15 minutes
      role: "user",
      aud: "test.com"
    };

    it('should generate a properly formatted JWT', () => {
      
      console.log(testKeys);

      const result = generateJwt({ data: testPayload, keys: { privateKey: testKeys.privateKey} });
      console.log(result.jwt);
      expect(result.error).toBeUndefined();
      expect(result.jwt).toBeDefined();
      
      if (!result.jwt) throw new Error('JWT not generated');
      const jwtParts = result.jwt.split('.');
      expect(jwtParts.length).toBe(3); // header.payload.signature
    });

    it('should return error when private key is missing', () => {
      const originalKey = process.env.JWT_PRIVATE_KEY;
      delete process.env.JWT_PRIVATE_KEY;
      
      const result = generateJwt({ data: testPayload });
      expect(result.jwt).toBeUndefined();
      expect(result.error).toBe('Unable to locate private key');
      
      process.env.JWT_PRIVATE_KEY = originalKey;
    });
  });

  describe('verifyJwt()', () => {
    const testPayload: JwtPayloadData = {
      sub: "test-user",
      email: "test@example.com",
      iat: Date.now(),
      exp: Date.now() + 900000, // 15 minutes
      role: "user",
      aud: "test.com"
    };

    it('should verify a valid JWT', () => {
      const result = generateJwt({ data: testPayload });
      if (!result.jwt) throw new Error('JWT not generated');
      
      const parts = result.jwt.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format');
      const [header, payloadPart, signature] = parts;
      if (!header || !payloadPart || !signature) throw new Error('Missing JWT parts');
      const signingInput = `${header}.${payloadPart}`;
      
      const { isVerified: isValid } = verifyJwt(signingInput, signature as string);
      expect(isValid).toBe(true);
    });

    it('should reject invalid signature', () => {
      const result = generateJwt({ data: testPayload });
      if (!result.jwt) throw new Error('JWT not generated');
      
      const parts = result.jwt.split('.');
      if (parts.length < 2) throw new Error('Invalid JWT format');
      const [header, payloadPart] = parts;
      if (!header || !payloadPart) throw new Error('Missing JWT parts');
      const signingInput = `${header}.${payloadPart}`;
      
      const { isVerified: isValid } = verifyJwt(signingInput, 'invalid-signature');
      expect(isValid).toBe(false);
    });

    it('should return error when public key is missing', () => {
      const originalKey = process.env.JWT_PUBLIC_KEY;
      delete process.env.JWT_PUBLIC_KEY;
      
      const genResult = generateJwt({ data: testPayload });
      if (!genResult.jwt) throw new Error('JWT not generated');
      
      const parts = genResult.jwt.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format');
      const [header, payloadPart, signature] = parts;
      if (!header || !payloadPart || !signature) throw new Error('Missing JWT parts');
      const signingInput = `${header}.${payloadPart}`;
      
      const { error, isVerified } = verifyJwt(signingInput, signature as string);
      expect(error).toEqual("Unable to locate public key");
      expect(isVerified).toEqual(false);
      
      process.env.JWT_PUBLIC_KEY = originalKey;
    });
  });
});
