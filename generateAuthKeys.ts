import { generateKeyPair } from "./src/helpers/auth";
import fs from "fs/promises";
import path from "path";

const envPath = path.resolve(__dirname, ".env.local")

const generateAuthKeys = async () => {
    const { publicKey, privateKey } = await generateKeyPair();
    console.log("generating keys");
    // console.log(publicKey);
    // console.log(privateKey);
    try {
        const envContent = await fs.readFile(envPath, 'utf-8');

        const splitEnvContent = envContent.split(/\r?\n/g);
        let publicExists, privateExists = false;

        for (const line in splitEnvContent) {
                if (splitEnvContent[line]?.startsWith("JWT_PUBLIC_KEY=")) {
                    publicExists = true;
                    splitEnvContent[line] = `JWT_PUBLIC_KEY=${publicKey}`;
                }
                if (splitEnvContent[line]?.startsWith("JWT_PRIVATE_KEY=")) {
                    publicExists = true;
                    splitEnvContent[line] = `JWT_PRIVATE_KEY=${publicKey}`;
                }
        };
        
        let finalEnv = splitEnvContent.join("\n");

        if (!publicExists) {
            finalEnv += `\nJWT_PUBLIC_KEY="${publicKey}"`;
        } 
        if (!privateExists) {
            finalEnv += `\nJWT_PRIVATE_KEY="${privateKey}"`;
        }

        await fs.writeFile(envPath, finalEnv);
        
    } catch (err) {
        console.log("error");
        console.log(err);
    }
}

generateAuthKeys();