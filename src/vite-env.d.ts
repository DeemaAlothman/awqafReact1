/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
  // أضف متغيرات بيئتك هنا إذا لزم
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
