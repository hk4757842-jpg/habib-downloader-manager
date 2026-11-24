const container = document.querySelector("#downloads");
const refreshButton = document.querySelector("#refresh");

async function loadDownloads() {
  const items = await chrome.downloads.search({
    limit: 50,
    orderBy: ["-startTime"]
  });

  container.replaceChildren();

  if (!items.length) {
    container.textContent = "No downloads yet.";
    return;
  }

  for (const item of items) {
    const name = item.filename.split(/[\\/]/).pop() || "Unknown";
    const progress = item.totalBytes > 0
      ? Math.floor((item.bytesReceived / item.totalBytes) * 100)
      : 0;

    const card = document.createElement("div");
    card.className = "download";

    const title = document.createElement("div");
    title.className = "download-name";
    title.textContent = name;

    const status = document.createElement("div");
    status.textContent = `${item.state} · ${progress}%`;

    const actions = document.createElement("div");
    actions.className = "actions";

    if (item.state === "in_progress") {
      const pause = document.createElement("button");
      pause.textContent = "Pause";
      pause.onclick = () => chrome.downloads.pause(item.id);
      actions.append(pause);

      const cancel = document.createElement("button");
      cancel.textContent = "Cancel";
      cancel.onclick = () => chrome.downloads.cancel(item.id);
      actions.append(cancel);
    }

    if (item.state === "interrupted") {
      const resume = document.createElement("button");
      resume.textContent = "Resume";
      resume.onclick = () => chrome.downloads.resume(item.id);
      actions.append(resume);
    }

    card.append(title, status, actions);
    container.append(card);
  }
}

refreshButton.addEventListener("click", loadDownloads);
chrome.downloads.onChanged.addListener(loadDownloads);
loadDownloads();
