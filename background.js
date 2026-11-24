chrome.runtime.onInstalled.addListener(() => {
  console.log("Habib Download Manager installed");
});

chrome.downloads.onCreated.addListener((download) => {
  console.log("Download started:", download.url);
});
