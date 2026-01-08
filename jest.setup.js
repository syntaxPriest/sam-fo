import '@testing-library/jest-dom';

// Mock IndexedDB
const indexedDB = {
  open: jest.fn(),
  deleteDatabase: jest.fn(),
};

Object.defineProperty(window, 'indexedDB', {
  value: indexedDB,
  writable: true,
});

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  value: true,
  writable: true,
});

// Mock Service Worker
Object.defineProperty(navigator, 'serviceWorker', {
  value: {
    register: jest.fn().mockResolvedValue({
      installing: null,
      waiting: null,
      active: null,
      addEventListener: jest.fn(),
    }),
    ready: Promise.resolve({
      sync: {
        register: jest.fn().mockResolvedValue(undefined),
      },
    }),
    addEventListener: jest.fn(),
  },
  writable: true,
});

// Mock fetch
global.fetch = jest.fn();
