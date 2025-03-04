export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      if (reader.result) {
        resolve(reader.result as string); // Return the Base64 string
      } else {
        reject(new Error("FileReader failed to read the file."));
      }
    };
    reader.onerror = (error) => reject(error);
  });
}
