chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "sniffscord_message") {
        fetch("http://localhost:7898/message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(message.payload)
        }).then(res => {
            console.log("Message sent to server");
        }).catch(err => {
            console.error("Error sending message to server:", err);
        });
    }
});
