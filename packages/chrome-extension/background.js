// Background script for AI SDK DevTools Chrome Extension

chrome.runtime.onInstalled.addListener(() => {
  console.log('AI SDK DevTools extension installed');
});

// Handle messages from content script and devtools
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'AI_EVENT') {
    // Forward AI events to all devtools panels
    chrome.runtime.sendMessage({
      type: 'AI_EVENT_FORWARD',
      event: message.event,
      tabId: sender.tab?.id
    });
  } else if (message.type === 'REQUEST_STATE') {
    // Handle state requests from devtools
    chrome.tabs.sendMessage(message.tabId, {
      type: 'GET_STATE',
      storeId: message.storeId
    }, (response) => {
      sendResponse(response);
    });
    return true; // Keep message channel open for async response
  }
});

// Handle tab updates to inject content script
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    // Inject content script if not already injected
    chrome.scripting.executeScript({
      target: { tabId },
      files: ['content.js']
    }).catch(() => {
      // Ignore errors (script might already be injected)
    });
  }
});
