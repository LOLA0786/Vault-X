import { extractPdfText } from './pdf-utils';

export interface FileProcessingResult {
  content: string;
  type: 'text' | 'image' | 'data';
  metadata?: {
    rows?: number;
    columns?: string[];
    imageType?: string;
    size?: { width: number; height: number };
  };
}

/**
 * Extract text content from various file types
 */
export async function extractFileContent(
  file: { fileName: string; fileType: string; encryptedData: string },
  decryptedData: string | Uint8Array
): Promise<FileProcessingResult> {
  const fileName = file.fileName.toLowerCase();
  const fileType = file.fileType.toLowerCase();

  // PDF files
  if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
    const pdfBytes = decryptedData instanceof Uint8Array ? decryptedData : new Uint8Array();
    const text = await extractPdfText(pdfBytes);
    return {
      content: text,
      type: 'text'
    };
  }

  // Image files
  if (fileType.startsWith('image/') || /\.(png|jpg|jpeg|gif|webp)$/.test(fileName)) {
    return {
      content: `[Image file: ${file.fileName}]\nThis is an image file. AI can analyze the image if you describe what you'd like to know about it.`,
      type: 'image',
      metadata: {
        imageType: fileType
      }
    };
  }

  // CSV files
  if (fileType === 'text/csv' || fileType === 'application/csv' || fileName.endsWith('.csv')) {
    const csvText = typeof decryptedData === 'string' ? decryptedData : new TextDecoder().decode(decryptedData);
    const result = parseCSV(csvText);
    return {
      content: result.content,
      type: 'data',
      metadata: {
        rows: result.rows,
        columns: result.columns
      }
    };
  }

  // Markdown files
  if (fileType === 'text/markdown' || fileName.endsWith('.md')) {
    const text = typeof decryptedData === 'string' ? decryptedData : new TextDecoder().decode(decryptedData);
    return {
      content: `[Markdown Document: ${file.fileName}]\n\n${text}`,
      type: 'text'
    };
  }

  // DOC files (legacy Word documents)
  if (fileType === 'application/msword' || fileName.endsWith('.doc')) {
    // Note: Full DOC parsing would require a library like mammoth.js
    // For now, we'll indicate it's a binary format that needs special handling
    return {
      content: `[Legacy Word Document: ${file.fileName}]\nThis is a legacy .DOC file. For full text extraction, please convert to .DOCX format. Limited text content may be available.`,
      type: 'text'
    };
  }

  // DOCX files (modern Word documents)
  if (fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || fileName.endsWith('.docx')) {
    // Note: Full DOCX parsing would require a library like mammoth.js or docx-parser
    // For now, we'll indicate it's a structured document
    return {
      content: `[Word Document: ${file.fileName}]\nThis is a Microsoft Word document. For full text extraction, a DOCX parser would be needed. The document structure and some text content may be available.`,
      type: 'text'
    };
  }

  // Plain text files (TXT, MD, etc.)
  const text = typeof decryptedData === 'string' ? decryptedData : new TextDecoder().decode(decryptedData);
  return {
    content: text,
    type: 'text'
  };
}

/**
 * Parse CSV content and return formatted text with metadata
 */
function parseCSV(csvText: string): { content: string; rows: number; columns: string[] } {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length === 0) {
    return { content: 'Empty CSV file', rows: 0, columns: [] };
  }

  // Parse header row
  const headers = parseCSVLine(lines[0]);
  const dataRows = lines.slice(1).map(line => parseCSVLine(line));
  
  // Create formatted content
  let content = `[CSV Data: ${headers.length} columns, ${dataRows.length} rows]\n\n`;
  content += `Columns: ${headers.join(', ')}\n\n`;
  
  // Show first few rows as sample
  const sampleRows = Math.min(5, dataRows.length);
  if (sampleRows > 0) {
    content += 'Sample data:\n';
    for (let i = 0; i < sampleRows; i++) {
      const row = dataRows[i];
      content += headers.map((header, idx) => `${header}: ${row[idx] || 'N/A'}`).join(', ') + '\n';
    }
    
    if (dataRows.length > sampleRows) {
      content += `\n... and ${dataRows.length - sampleRows} more rows`;
    }
  }

  return {
    content,
    rows: dataRows.length,
    columns: headers
  };
}

/**
 * Simple CSV line parser (handles basic quoted fields)
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current.trim());
  return result;
}

/**
 * Get file type category for display purposes
 */
export function getFileTypeCategory(fileName: string, fileType: string): {
  category: 'document' | 'image' | 'data' | 'text';
  icon: string;
  color: string;
} {
  const name = fileName.toLowerCase();
  const type = fileType.toLowerCase();

  if (type.startsWith('image/') || /\.(png|jpg|jpeg|gif|webp)$/.test(name)) {
    return { category: 'image', icon: '🖼️', color: 'purple' };
  }

  if (type === 'text/csv' || name.endsWith('.csv')) {
    return { category: 'data', icon: '📊', color: 'orange' };
  }

  if (type === 'application/pdf' || name.endsWith('.pdf')) {
    return { category: 'document', icon: '📄', color: 'red' };
  }

  if (type.includes('word') || name.endsWith('.doc') || name.endsWith('.docx')) {
    return { category: 'document', icon: '📝', color: 'blue' };
  }

  if (name.endsWith('.md')) {
    return { category: 'text', icon: '📋', color: 'green' };
  }

  return { category: 'text', icon: '📄', color: 'gray' };
}