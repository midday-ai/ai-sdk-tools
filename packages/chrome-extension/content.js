// Content script for AI SDK DevTools Chrome Extension

(function() {
  'use strict';

  // Check if we're already injected
  if (window.aiDevtoolsInjected) {
    return;
  }
  window.aiDevtoolsInjected = true;

  // Import the stream interceptor from the existing devtools package
  // This would be bundled and injected
  const { StreamInterceptor } = window.AISDKDevtools;

  let streamInterceptor = null;
  let isCapturing = true;
  let events = [];
  let stores = new Map();

  // Initialize stream interceptor
  function initializeInterceptor() {
    if (streamInterceptor) {
      return;
    }

    streamInterceptor = new StreamInterceptor({
      onEvent: (event) => {
        events.push(event);
        
        // Send event to background script
        chrome.runtime.sendMessage({
          type: 'AI_EVENT',
          event: event,
          timestamp: Date.now()
        });

        // Keep only last 1000 events
        if (events.length > 1000) {
          events = events.slice(-1000);
        }
      },
      endpoints: ['/api/chat', '/api/ai', '/api/stream'],
      enabled: isCapturing,
      debug: false
    });

    streamInterceptor.patch();
  }

  // Watch for AI SDK stores
  function watchStores() {
    // Look for AI SDK stores in the page
    const checkForStores = () => {
      // This would need to be adapted based on how stores are exposed
      if (window.__AI_SDK_STORES__) {
        window.__AI_SDK_STORES__.forEach((store, id) => {
          if (!stores.has(id)) {
            stores.set(id, store);
            
            // Send store info to devtools
            chrome.runtime.sendMessage({
              type: 'STORE_DETECTED',
              storeId: id,
              store: store
            });
          }
        });
      }
    };

    // Check immediately and then periodically
    checkForStores();
    setInterval(checkForStores, 1000);
  }

  // Handle messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.type) {
      case 'TOGGLE_CAPTURING':
        isCapturing = message.enabled;
        if (streamInterceptor) {
          streamInterceptor.updateOptions({ enabled: isCapturing });
        }
        sendResponse({ success: true });
        break;

      case 'CLEAR_EVENTS':
        events = [];
        sendResponse({ success: true });
        break;

      case 'GET_EVENTS':
        sendResponse({ events });
        break;

      case 'GET_STATE':
        const store = stores.get(message.storeId);
        if (store) {
          // Get current state from store
          const state = store.getState ? store.getState() : store;
          sendResponse({ state, success: true });
        } else {
          sendResponse({ error: 'Store not found', success: false });
        }
        break;

      case 'GET_STORES':
        sendResponse({ 
          stores: Array.from(stores.keys()),
          success: true 
        });
        break;
    }
  });

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initializeInterceptor();
      watchStores();
    });
  } else {
    initializeInterceptor();
    watchStores();
  }

  // Also initialize on window load as fallback
  window.addEventListener('load', () => {
    if (!streamInterceptor) {
      initializeInterceptor();
      watchStores();
    }
  });

})();
