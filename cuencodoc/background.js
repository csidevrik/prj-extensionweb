chrome.runtime.onMessage.addListener((message, sender) => {
    if (message.action === 'descargar') {
      chrome.downloads.download({
        url: message.url,
        filename: `descargas/${message.filename}`,
        conflictAction: 'uniquify',
        saveAs: false
      });
    }
  });

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "descargar-recientes",
    title: "📁 Descargar archivos recientes",
    contexts: ["all"]
  });
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "descargar-recientes") {
    chrome.tabs.sendMessage(tab.id, { action: "activarSeleccion" });
  }
});