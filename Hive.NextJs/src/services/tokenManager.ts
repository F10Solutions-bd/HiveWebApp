import axios from 'axios';
const baseUrl = process.env.NEXT_PUBLIC_API_URL;

import { getOrCreateKeyPair } from "@/lib/dpop/store";
import { createDPoPProof } from "@/lib/dpop/proof";

export async function getAccessToken(): Promise<string | null> {
    try {
        const url = `${baseUrl}/auth/access-token`;
        const keyPair = await getOrCreateKeyPair();
        const dpopProof = await createDPoPProof('POST', url, keyPair);

        const response = await axios.post(
            url,
            {},
            {
                withCredentials: true,
                headers: { 'DPoP': dpopProof || '' }
            }
        );

        if (response.status == 200) {
            return response.data.accessToken;
        }

        return null;
    } catch (error) {
        console.error('Error getting access token:', error);
        return null;
    }
}
