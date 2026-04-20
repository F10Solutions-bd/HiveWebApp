import * as jose from "jose";

export async function createDPoPProof(
    method: string,
    url: string,
    keyPair: CryptoKeyPair | null
) {
    if (!keyPair) return null; // Server Side Rendering (does not sign)

    return await new jose.SignJWT({
        htm: method,
        htu: url,
        jti: crypto.randomUUID(),
    })
        .setProtectedHeader({
            typ: "dpop+jwt",
            alg: "ES256",
            jwk: await jose.exportJWK(keyPair.publicKey),
        })
        .setIssuedAt()
        .sign(keyPair.privateKey);
}
