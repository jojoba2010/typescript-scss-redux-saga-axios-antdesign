// Usage:
// Replace React.lazy(() => import('x'));
// with retryDynamicImport(() => import('x'));
//https://gist.github.com/mberneti/28769391cf27f7580a55dedab342c63a
//https://gist.github.com/alireza-ahmadi/5280d6d069f2398be6ce61d07d5f9c26
//https://www.linkedin.com/feed/update/urn:li:activity:7251190200184295424/

import { ComponentType, lazy } from 'react';

const MAX_RETRY_COUNT = 15;
const RETRY_DELAY_MS = 500;

// Regex to extract the module URL from the import statement
const uriOrRelativePathRegex = /import\(["']([^)]+)['"]\)/;

// Function to extract the component URL from the dynamic import
const getRouteComponentUrl = (originalImport: () => Promise<any>): string | null => {
  try {
    const fnString = originalImport.toString();
    return fnString.match(uriOrRelativePathRegex)?.[1] || null;
  } catch (e) {
    console.error('Error extracting component URL:', e);
    return null;
  }
};

// Function to create a retry import function with versioned query parameter
const getRetryImportFunction = (
  originalImport: () => Promise<any>,
  retryCount: number
): (() => Promise<any>) => {
  const importUrl = getRouteComponentUrl(originalImport);
  if (!importUrl || retryCount === 0) {
    return originalImport;
  }

  // Add or update the version query parameter in the import URL
  const importUrlWithVersionQuery = importUrl.includes('?')
    ? `${importUrl}&v=${retryCount}-${Math.random().toString(36).substring(2)}`
    : `${importUrl}?v=${retryCount}-${Math.random().toString(36).substring(2)}`;

  // return () => import(/* @vite-ignore */ importUrlWithVersionQuery);
  return () => import(/* webpackIgnore: true */ importUrlWithVersionQuery);

};

// Main function to wrap the dynamic import with retry logic
export function retryDynamicImport<T extends ComponentType<any>>(
  importFunction: () => Promise<{ default: T }>
): React.LazyExoticComponent<T> {
  let retryCount = 0;

  const loadComponent = (): Promise<{ default: T }> =>
    new Promise((resolve, reject) => {
      function tryLoadComponent() {
        const retryImport = getRetryImportFunction(importFunction, retryCount);

        retryImport()
          .then((module) => {
            if (retryCount > 0) {
              console.log(
                `Component loaded successfully after ${retryCount} ${retryCount === 1 ? 'retry' : 'retries'}.`
              );
            }
            resolve(module);
          })
          .catch((error) => {
            retryCount += 1;
            if (retryCount <= MAX_RETRY_COUNT) {
              console.warn(`Retry attempt ${retryCount} failed, retrying...`);
              setTimeout(() => {
                tryLoadComponent();
              }, retryCount * RETRY_DELAY_MS);
            } else {
              console.error('Failed to load component after maximum retries. Reloading the page...');
              reject(error);
              window.location.reload();
            }
          });
      }

      tryLoadComponent();
    });

  return lazy(() => loadComponent());
}
