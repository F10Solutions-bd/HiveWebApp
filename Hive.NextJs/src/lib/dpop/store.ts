import { generateDPoPKeyPair } from "./keypair";
import { saveKeyPair, getKeyPair } from "./indexeddb";

let memoryKeyPair: CryptoKeyPair | null = null;

export async function getOrCreateKeyPair() {
    if (typeof window === "undefined") {
        return null;
    }

    if (memoryKeyPair) return memoryKeyPair;

    // Retrieve full native pair directly from DB (Structured Clone supports non-extractable keys!)
    const existingPair = await getKeyPair();

    if (existingPair) {
        memoryKeyPair = existingPair;
        return memoryKeyPair;
    }

    // Generate BRAND NEW if first time
    const newPair = await generateDPoPKeyPair();

    // Store directly into IndexedDB without exporting to JSON
    await saveKeyPair(newPair);

    memoryKeyPair = newPair;

    return memoryKeyPair;
}
