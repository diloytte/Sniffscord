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

                    log(`🎯 ${username}: ${text}`);
                }
            }
        });

        observer.observe(container, { childList: true, subtree: true });
        log("🔭 Sniffscord is observing messages...");
    };

    setTimeout(initObserver, 750);
})();
