/// <reference types="vite/client" />

interface ImportMetaEnv {
  /**
   * Web3Forms access key for the contact form. Set it in `.env` locally and
   * as a GitHub Actions secret — never commit the real key (see README).
   */
  readonly VITE_WEB3FORMS_KEY?: string;
}
