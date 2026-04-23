// Vite env type augmentation (resolves without npm install)
interface ImportMeta {
  readonly env: Record<string, string | undefined>
}
