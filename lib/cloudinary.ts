// Convert file to base64 data URL for database storage
export async function uploadImage(file: File): Promise<string> {
  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');
    const mimeType = file.type || 'image/jpeg';
    
    // Return as data URL (dapat langsung digunakan di <img src="">)
    return `data:${mimeType};base64,${base64}`;
  } catch (error) {
    console.error('Upload error:', error);
    throw error;
  }
}

// No need to delete since images are stored in database
export async function deleteImage(imageUrl: string) {
  // Images stored in database, no file system cleanup needed
  return;
}
