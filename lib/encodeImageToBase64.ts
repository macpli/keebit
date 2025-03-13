export function encodeImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string); // Returns full Base64 string (including `data:image/png;base64,`)
      reader.onerror = (error) => reject(error);
    });
}