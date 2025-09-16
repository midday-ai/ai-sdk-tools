// Injected script for AI SDK DevTools Chrome Extension
// This script runs in the page context and can access the AI SDK directly

// Expose AI SDK stores to the content script
function exposeAIStores() {
  // Look for common AI SDK store patterns
  const storePatterns = [
    // Vercel AI SDK patterns
    'window.__AI_SDK_STORES__',
    'window.__AI_SDK_STATE__',
    'window.__AI_SDK_CONTEXT__',
    
    // Custom store patterns
    'window.aiStores',
    'window.aiState',
    'window.chatStores',
    
    // React context patterns
    'window.__REACT_DEVTOOLS_GLOBAL_HOOK__'
  ];

  let foundStores: any[] = [];

  // Check each pattern
  storePatterns.forEach(pattern => {
    try {
      const stores = eval(pattern);
      if (stores && typeof stores === 'object') {
        foundStores.push(stores);
      }
    } catch (e) {
      // Pattern doesn't exist, continue
    }
  });

  // Also look for stores in React components
  if (window.React && window.React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED) {
    // This is a more advanced pattern to find React stores
    // Implementation would depend on the specific AI SDK setup
  }

  return foundStores;
}

// Create a global store registry
if (!window.__AI_SDK_STORES__) {
  window.__AI_SDK_STORES__ = new Map();
}

// Periodically check for new stores
setInterval(() => {
  const stores = exposeAIStores();
  stores.forEach(store => {
    if (store && typeof store === 'object') {
      // Add to global registry
      const id = `store_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      window.__AI_SDK_STORES__.set(id, store);
      
      // Notify content script
      window.postMessage({
        type: 'AI_SDK_STORE_DETECTED',
        storeId: id,
        store: store
      }, '*');
    }
  });
}, 2000);

// Listen for messages from content script
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  
  if (event.data.type === 'AI_SDK_GET_STATE') {
    const store = window.__AI_SDK_STORES__.get(event.data.storeId);
    if (store) {
      const state = store.getState ? store.getState() : store;
      window.postMessage({
        type: 'AI_SDK_STATE_RESPONSE',
        storeId: event.data.storeId,
        state: state
      }, '*');
    }
  }
});

// Expose the store registry globally
window.__AI_SDK_DEVTOOLS__ = {
  getStores: () => Array.from(window.__AI_SDK_STORES__.keys()),
  getStore: (id: string) => window.__AI_SDK_STORES__.get(id),
  getStoreState: (id: string) => {
    const store = window.__AI_SDK_STORES__.get(id);
    return store ? (store.getState ? store.getState() : store) : null;
  }
};
