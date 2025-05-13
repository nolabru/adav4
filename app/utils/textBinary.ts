// Browser-compatible wrapper for istextorbinary
export interface EncodingOpts {
  /** Defaults to 24 */
  chunkLength?: number;

  /** If not provided, will check the start, beginning, and end */
  chunkBegin?: number;
}

export function getEncoding(buffer: Buffer | null, _opts?: EncodingOpts): 'utf8' | 'binary' | null {
  if (!buffer) {
    return null;
  }

  // Convert Buffer to Uint8Array for browser compatibility
  const uint8Array = new Uint8Array(buffer);

  return isText(uint8Array) ? 'utf8' : 'binary';
}

export function isText(buffer: any): boolean {
  // Simple implementation that works in browser
  if (typeof buffer === 'string') {
    return true;
  }

  // Check for common binary file signatures
  if (buffer instanceof ArrayBuffer || buffer instanceof Uint8Array) {
    const view = buffer instanceof ArrayBuffer ? new Uint8Array(buffer) : buffer;
    const firstBytes = view.slice(0, 8);

    // Check for common binary file signatures (PDF, PNG, JPG, etc.)
    const binarySignatures = [
      [0x25, 0x50, 0x44, 0x46], // PDF
      [0x89, 0x50, 0x4e, 0x47], // PNG
      [0xff, 0xd8, 0xff], // JPG
      [0x47, 0x49, 0x46, 0x38], // GIF
      [0x50, 0x4b, 0x03, 0x04], // ZIP
    ];

    return !binarySignatures.some((sig) => sig.every((byte, i) => firstBytes[i] === byte));
  }

  return true;
}

export function isBinary(buffer: any): boolean {
  return !isText(buffer);
}
