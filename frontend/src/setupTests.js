import '@testing-library/jest-dom/extend-expect';

// Mock the import.meta.env used by Vite
const mockImportMeta = {
  env: {
    VITE_BACKEND_URL: 'http://localhost:5001', // Mock the expected value
  },
};

global.importMeta = mockImportMeta;

// Patch the `import.meta` object for Jest to simulate Vite environment
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      env: mockImportMeta.env,
    },
  },
  writable: true,
});
