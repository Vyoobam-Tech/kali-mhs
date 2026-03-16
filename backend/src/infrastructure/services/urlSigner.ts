import jwt from 'jsonwebtoken';
import { config } from '@config/env';

export interface SignedUrlPayload {
    documentId: string;
    leadId: string;
    expiresAt: number;
}

/**
 * URL Signer Service
 * Generates and verifies signed URLs for secure document downloads
 */
export class UrlSignerService {
    // Dedicated secret — separate from JWT secret to limit blast radius
    private static readonly SECRET = config.urlSigner.secret;
    private static readonly DEFAULT_EXPIRY = 3600; // 1 hour in seconds

    /**
     * Generate a signed URL token for document download
     */
    static generateSignedUrl(
        documentId: string,
        leadId: string,
        expiresIn: number = this.DEFAULT_EXPIRY
    ): string {
        const payload: SignedUrlPayload = {
            documentId,
            leadId,
            expiresAt: Date.now() + expiresIn * 1000,
        };

        return jwt.sign(payload, this.SECRET, {
            expiresIn,
        });
    }

    /**
     * Verify and decode a signed URL token
     */
    static verifySignedUrl(token: string): SignedUrlPayload | null {
        try {
            const decoded = jwt.verify(token, this.SECRET) as SignedUrlPayload;

            // Check if token has expired
            if (decoded.expiresAt < Date.now()) {
                console.warn('Signed URL has expired');
                return null;
            }

            return decoded;
        } catch (error) {
            console.error('Invalid signed URL:', error);
            return null;
        }
    }

    /**
     * Generate a complete download URL with token
     */
    static generateDownloadUrl(
        documentId: string,
        leadId: string,
        expiresIn?: number
    ): string {
        const token = this.generateSignedUrl(documentId, leadId, expiresIn);
        // Use the backend's own API base URL — not the frontend URL
        const baseUrl = config.urlSigner.apiBaseUrl;
        return `${baseUrl}/documents/download/${token}`;
    }
}

export const urlSigner = UrlSignerService;
