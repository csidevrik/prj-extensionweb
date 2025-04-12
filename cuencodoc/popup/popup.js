// document.getElementById('startBtn').addEventListener('click', async () => {
//     const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
//     chrome.scripting.executeScript({
//       target: { tabId: tab.id },
//       func: () => {
//         window.dispatchEvent(new CustomEvent('activarSeleccionDocumentos'));
//       }
//     });
//   });

  document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("startBtn").addEventListener("click", async () => {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "activarSeleccion" });
      });
    });
  });
  