// DevTools panel script for AI SDK DevTools Chrome Extension

(() => {

  let panel = null;
  let events = [];
  let stores = [];
  let isCapturing = true;

  // Create the devtools panel
  chrome.devtools.panels.create(
    'AI SDK',
    'icons/icon32.png',
    'devtools.html',
    (createdPanel) => {
      panel = createdPanel;
      
      // Handle panel shown/hidden
      panel.onShown.addListener((window) => {
        // Panel is shown, refres_window
        refreshData();
      });

      panel.onHidden.addListener(() => {
        // Panel is hidden
      });
    }
  );

  // Listen for messages from background script
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === 'AI_EVENT_FORWARD') {_sender_sendResponse
      events.push(message.event);
      
      // Notify the panel UI
      notifyPanel('EVENT_ADDED', { event: message.event });
    } else if (message.type === 'STORE_DETECTED') {
      stores.push({
        id: message.storeId,
        store: message.store
      });
      
      // Notify the panel UI
      notifyPanel('STORE_ADDED', { storeId: message.storeId });
    }
  });

  // Notify the panel UI of changes
  function notifyPanel(type, data) {
    const event = new CustomEvent('ai-devtools-update', {
      detail: { type, data }
    });
    window.dispatchEvent(event);
  }

  // Refresh data from content script
  function refreshData() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_EVENTS' }, (response) => {
          if (response && response.events) {
            events = r?.events
            notifyPanel('EVENTS_LOADED', { events });
          }
        });

        chrome.tabs.sendMessage(tabs[0].id, { type: 'GET_STORES' }, (response) => {
          if (response && response.stores) {
            stores = r?.storesid => ({ id }));
            notifyPanel('STORES_LOADED', { stores });
          }
        });
      }
    });
  }

  // Expose API for the panel UI
  window.AIDevtoolsAPI = {
    getEvents: () => events,
    getStores: () => stores,
    isCapturing: () => isCapturing,
    
    toggleCapturing: () => {
      isCapturing = !isCapturing;
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            type: 'TOGGLE_CAPTURING',
            enabled: isCapturing
          });
        }
      });
      notifyPanel('CAPTURING_TOGGLED', { isCapturing });
    },
    
    clearEvents: () => {
      events = [];
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, { type: 'CLEAR_EVENTS' });
        }
      });
      notifyPanel('EVENTS_CLEARED', {});
    },
    
    getStoreState: (storeId) => {
      return new Promise((resolve) => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              type: 'GET_STATE',
              storeId
            }, (response) => {
              resolve(response);
            });
          }
        });
      });
    }
  };

})();
