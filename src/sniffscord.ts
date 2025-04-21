(() => {
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

    const sendToServer = (sender: string, message: string) => {
        fetch("http://localhost:7898/message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sender, message }),
        })
          .then((res) => {
            if (!res.ok) throw new Error("Failed to send message");
            console.log("[📡] Message sent to server.");
          })
          .catch((err) => {
            console.warn("[❌] Failed to send to server:", err);
          });
      }
      

    const findMessageContainer = (): HTMLElement | null => {
        const sampleMessage = document.querySelector<HTMLElement>('li[id^="chat-messages"]');
        return sampleMessage?.parentElement || null;
    };

    const shouldIncludeUser = (usernameRaw: string | undefined | null): boolean => {
        if (!usernameRaw) return false;
        const username = usernameRaw.toLowerCase();
        return CONFIG.includeUsernames.some((entry:any) => username.includes(entry));
    };

    const initObserver = () => {
        if (CONFIG.channelUrlIncludes && !window.location.href.includes(CONFIG.channelUrlIncludes)) {
            return;
        }

        const container = findMessageContainer();
        if (!container) {
            setTimeout(initObserver, 750);
            return;
        }

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (!(node instanceof HTMLElement)) continue;
                    if (!node.id?.startsWith("chat-messages")) continue;

                    const usernameEl = node.querySelector<HTMLSpanElement>('span[id^="message-username"] span');
                    const msgSpan = node.querySelector<HTMLSpanElement>('div[id^="message-content"] span');

                    if (!usernameEl || !msgSpan) {
                        log("⚠️ Skipping message — username or content missing");
                        continue;
                    }

                    const username = usernameEl.textContent?.trim();
                    const text = msgSpan.textContent?.trim();

                    if (!text || !username) continue;

                    if (!shouldIncludeUser(username)) {
                        log(`🚫 Ignored: ${username}: ${text}`);
                        continue;
                    }

                    sendToServer(username, text);
                    log(`🎯 ${username}: ${text}`);

                }
            }
        });

        observer.observe(container, { childList: true, subtree: true });
        log("🔭 Sniffscord is observing messages...");
    };

    setTimeout(initObserver, 750);
})();
