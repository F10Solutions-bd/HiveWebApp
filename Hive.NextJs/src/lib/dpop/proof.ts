import * as jose from "jose";

export async function createDPoPProof(
    method: string,
    url: string,
    keyPair: CryptoKeyPair | null
) {
    if (!keyPair) return null;

    const now = Math.floor(Date.now() / 1000);

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
        .setIssuedAt(now)
        .setExpirationTime(now + 5) // 5 seconds expiry
        .sign(keyPair.privateKey);
}
