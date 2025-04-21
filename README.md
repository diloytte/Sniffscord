```markdown
# 🕵️‍♂️ Sniffscord

**Sniffscord** is a lightweight TypeScript-powered script that watches a Discord channel’s DOM for new messages, and logs only the ones you care about — based on usernames you configure.

Perfect for relaying alpha, staying updated when AFK, or just filtering out noise.

---

## 🚀 Features

- ✅ Real-time message sniffing from any open Discord channel
- ✅ Filters by username (partial + case-insensitive)
- ✅ Logs sender and full message body
- ✅ DOM-only — no bot, no API token, no TOS-breaking behavior
- ✅ Easy to extend, built in TypeScript

---

## 📦 Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Build the script

```bash
npx tsc
```

> This will generate `dist/sniffscord.js`

---

## 🔧 How to Use

1. Open Discord in your browser (must be in a specific channel)
2. Open **DevTools → Console**
3. First, define your config:

```js
window.SNIFFSCORD_CONFIG = {
    channelUrlIncludes: "", // optional: "" means match any channel
    includeUsernames: ["user name 1", "user name 2",] // lowercase substrings
};
```

4. Then paste in the contents of `dist/sniffscord.js`

You’ll now see logs for each message posted by those users.

---

## 🧾 Example Output

```
[🕵️‍♂️ Sniffscord] 🎯 Alpha: 
Bid $X
Risk reward: 1/10
Timeframe: medium 
```

---

## 🛠 Project Structure

```
sniffscord/
├── src/
│   └── sniffscord.ts        # TypeScript source
├── dist/
│   └── sniffscord.js        # Paste this in your browser console
├── tsconfig.json
├── package.json
└── README.md
```

---

## 🧠 Why DOM Instead of API?

- No token needed  
- No bot invite  
- 100% client-side  
- Zero spam or automation  
- Just like reading the screen yourself, but with eyes that don't blink

---