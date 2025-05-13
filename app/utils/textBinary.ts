// Browser-compatible wrapper for istextorbinary
export function isText(buffer: string | ArrayBuffer | Uint8Array): boolean {
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

export function isBinary(buffer: string | ArrayBuffer | Uint8Array): boolean {
  return !isText(buffer);
}
