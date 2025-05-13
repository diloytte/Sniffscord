const script = document.createElement("script");
script.src = chrome.runtime.getURL("injected.js");
script.onload = () => script.remove();
(document.head || document.documentElement).appendChild(script);

console.log("Content script injected successfully!");

window.addEventListener("message", (event) => {
  if (event.source !== window) return;
  if (event.data?.type === "sniffscord" && event.data?.source === "sniffscord") {
    let payload = {
      username: event.data.username,
      messageContent: event.data.messageContent,
      rawHtml: event.data.rawHtml
    }

    console.info(payload)
    chrome.runtime.sendMessage({
      type: "sniffscord_message",
      payload
    });
  }
});
