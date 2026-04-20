const DB_NAME = "dpop-db";
const STORE = "keys";
const VERSION = 1;

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, VERSION);

        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE)) {
                db.createObjectStore(STORE);
            }
        };

        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export async function saveKeyPair(keyPair: CryptoKeyPair) {
    if (typeof window === "undefined" || !("indexedDB" in window)) return false;
    
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readwrite");
        const store = tx.objectStore(STORE);

        const req = store.put(keyPair, "keyPair");

        req.onsuccess = () => resolve(true);
        req.onerror = () => reject(req.error);
    });
}

export async function getKeyPair(): Promise<CryptoKeyPair | null> {
    if (typeof window === "undefined" || !("indexedDB" in window)) return null;
    
    const db = await openDB();

    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE, "readonly");
        const store = tx.objectStore(STORE);

        const req = store.get("keyPair");

        req.onsuccess = () => resolve(req.result || null);
        req.onerror = () => reject(req.error);
    });
}
