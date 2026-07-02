/** GitHub Pages などサブパス配信時のベースパス (例: /life) */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function asset(path: string): string {
  return `${basePath}${path}`;
}
