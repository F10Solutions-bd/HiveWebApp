export async function generateDPoPKeyPair() {
    return await crypto.subtle.generateKey(
        {
            name: "ECDSA",
            namedCurve: "P-256"
        },
        false, // NON-EXPORTABLE: Private key stays locked inside browser
        ["sign", "verify"]
    );
}
