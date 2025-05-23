;(() => {
    'use strict';

    interface SniffscordConfig {
        channelUrlIncludes: string;
        includeUsernames: string[];
    }

    //@ts-ignore
    declare global {
        interface Window {
            SNIFFSCORD_CONFIG?: SniffscordConfig;
        }
    }

    const log = (...args: unknown[]) => {
        console.log("[🕵️‍♂️ Sniffscord]", ...args);
    };

    //@ts-ignore
    const CONFIG = window.SNIFFSCORD_CONFIG;

    if (!CONFIG) {
        console.warn("[Sniffscord] ⚠️ Missing global SNIFFSCORD_CONFIG.");
        return;
    }

    const findMessageContainer = (): HTMLElement | null => {
        const sampleMessage = document.querySelector<HTMLElement>('li[id^="chat-messages"]');
        console.log(sampleMessage); // Debugging
        return sampleMessage?.parentElement || null;
    };

    const initObserver = () => {
        if (CONFIG.channelUrlIncludes && !window.location.href.includes(CONFIG.channelUrlIncludes)) {
            return;
        }

        const container = findMessageContainer();
        if (!container) {
            log("⚠️ Couldn't find the message container. Retrying...");
            setTimeout(initObserver, 750);
            return;
        }

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;
                    if (!node.id?.startsWith("chat-messages")) continue;

                    const messageHtml = node.outerHTML;

                    const parser = new DOMParser();
                    const doc = parser.parseFromString(messageHtml, "text/html");
                    const username = doc.querySelector("[class^='username_']")?.textContent || "Unknown";
                    const messageContent = doc.querySelector("[class^='markup_'] span")?.textContent || "No message content";
                    log(`🎯 Sniffed message from ${username}: ${messageContent}`);

                    window.postMessage({
                        source: "sniffscord",
                        type: "sniffscord",
                        username,
                        messageContent,
                        rawHtml: messageHtml,
                    }, "*");
                    console.log("Message sent to background:", {
                        username,
                        messageContent,
                        rawHtml: messageHtml,
                    });

                }
            }
        });


        observer.observe(container, { childList: true, subtree: true });
        log("🔭 Sniffscord is observing messages...");
    };

    setTimeout(initObserver, 750);
})();
