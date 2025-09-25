// Simple test to verify chunked upload functionality
import { ChunkedUploadService } from '../chunked-upload';

describe('ChunkedUploadService', () => {
  test('shouldUseChunkedUpload returns correct values', () => {
    // Small file - should use traditional upload
    const smallFile = new File(['test'], 'small.txt', { type: 'text/plain' });
    Object.defineProperty(smallFile, 'size', { value: 1024 * 1024 }); // 1MB
    expect(ChunkedUploadService.shouldUseChunkedUpload(smallFile)).toBe(false);

    // Large file - should use chunked upload
    const largeFile = new File(['test'], 'large.pdf', { type: 'application/pdf' });
    Object.defineProperty(largeFile, 'size', { value: 10 * 1024 * 1024 }); // 10MB
    expect(ChunkedUploadService.shouldUseChunkedUpload(largeFile)).toBe(true);
  });

  test('calculateHash produces consistent results', () => {
    // Access private method for testing
    const calculateHash = (ChunkedUploadService as any).calculateHash;
    
    const data1 = new Uint8Array([1, 2, 3, 4, 5]);
    const data2 = new Uint8Array([1, 2, 3, 4, 5]);
    const data3 = new Uint8Array([1, 2, 3, 4, 6]);

    expect(calculateHash(data1)).toBe(calculateHash(data2));
    expect(calculateHash(data1)).not.toBe(calculateHash(data3));
  });
});