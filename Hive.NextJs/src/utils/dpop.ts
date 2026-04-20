import { SignJWT, exportJWK, generateKeyPair } from 'jose';

const DPOP_KEY_NAME = 'dpop_key_pair';
let cachedKeyPair: CryptoKeyPair | null = null;
let dbPromise: Promise<IDBDatabase> | null = null;

// Initialize IndexedDB to securely store the Extracted CryptoKeyPair
// Since CryptoKeyPair itself is structured-cloneable, IndexedDB is perfect.
function initDB(): Promise<IDBDatabase> {
    if (dbPromise) return dbPromise;

    dbPromise = new Promise((resolve, reject) => {
        const request = indexedDB.open('DPoP_Store', 1);

        request.onupgradeneeded = (event: any) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains('keys')) {
                db.createObjectStore('keys');
            }
        };

        request.onsuccess = (event: any) => resolve(event.target.result);
        request.onerror = (event: any) => reject(event.target.error);
    });

    return dbPromise;
}

// Retrieve Key Pair from IndexedDB
async function getKeyPairFromDB(): Promise<CryptoKeyPair | null> {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['keys'], 'readonly');
            const store = transaction.objectStore('keys');
            const request = store.get(DPOP_KEY_NAME);

            request.onsuccess = () => resolve(request.result || null);
            request.onerror = () => reject(request.error);
        });
    } catch {
        return null;
    }
}

// Save Key Pair to IndexedDB
async function saveKeyPairToDB(keyPair: CryptoKeyPair): Promise<void> {
    try {
        const db = await initDB();
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(['keys'], 'readwrite');
            const store = transaction.objectStore('keys');
            const request = store.put(keyPair, DPOP_KEY_NAME);

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    } catch (e) {
        console.warn('Failed to save DPoP key to IndexedDB', e);
    }
}

/**
 * Returns the Singleton DPoP Key Pair for this client.
 * If not exists, generates a new ECDSA P-256 key pair and persists it.
 */
export async function getClientKeyPair(): Promise<CryptoKeyPair> {
    if (cachedKeyPair) return cachedKeyPair;

    // Check IndexedDB
    if (typeof window !== 'undefined' && window.indexedDB) {
        const stored = await getKeyPairFromDB();
        if (stored) {
            cachedKeyPair = stored;
            return cachedKeyPair;
        }
    }

    // Generate new if not present
    const keyPair = await generateKeyPair('ES256', { extractable: false });
    cachedKeyPair = keyPair;

    if (typeof window !== 'undefined' && window.indexedDB) {
        await saveKeyPairToDB(keyPair);
    }

    return cachedKeyPair;
}

/**
 * Generates a standard DPoP Proof JWT for an outgoing request.
 * @param htm The HTTP Method (e.g., 'GET', 'POST').
 * @param htu The HTTP URL.
 * @returns Serialized JWT DPoP Proof.
 */
export async function generateDPoPProof(htm: string, htu: string): Promise<string> {
    const keyPair = await getClientKeyPair();
    const publicJwk = await exportJWK(keyPair.publicKey);

    // Normalize URL
    const url = new URL(htu);
    const normalizedHtu = `${url.protocol}//${url.host}${url.pathname}`;

    const proof = await new SignJWT({
        htm: htm.toUpperCase(),
        htu: normalizedHtu,
        jti: window.crypto.randomUUID()
    })
        .setProtectedHeader({
            alg: 'ES256',
            typ: 'dpop+jwt',
            jwk: publicJwk
        })
        .setIssuedAt()
        .sign(keyPair.privateKey);

    return proof;
}
