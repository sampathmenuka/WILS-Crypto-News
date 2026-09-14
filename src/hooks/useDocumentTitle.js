import { useEffect } from 'react';

const SITE_NAME = 'WILS Crypto News';

// Sets the browser tab title for the current page, e.g. "Markets · WILS Crypto News".
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME;
  }, [title]);
}
