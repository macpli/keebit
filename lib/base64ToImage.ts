export function base64ToImage(base64: string): string {
  return `data:image/png;base64,${base64}`;
}