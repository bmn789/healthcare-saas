/** Vite base-aware path so the SW registers when `base` is not `/`. */
export const serviceWorkerUrl = () => `${import.meta.env.BASE_URL}sw.js`

export const serviceWorkerScope = () => import.meta.env.BASE_URL
