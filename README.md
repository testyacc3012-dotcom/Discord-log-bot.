# Discord Logger Bot

Logs messages, members, moderation actions, server changes, and voice activity to a single `#logs` channel.

## Setup

1. **Create the channel** in your server named `logs` (or set `LOG_CHANNEL_NAME` in `.env` to whatever you want).

2. **Discord Developer Portal** (discord.com/developers/applications → your bot → Bot tab):
   - Enable **all three Privileged Gateway Intents**: `Presence`, `Server Members`, `Message Content`.
     This bot needs `Server Members` and `Message Content` to work at all — without them, join/leave and message logs won't fire.

3. **Invite the bot** with these permissions: `View Channel`, `Send Embeds`, `Read Message History`, `View Audit Log` (needed to show *who* banned someone, not just that it happened).

4. **Install & run locally to test:**
   ```
   npm install
   cp .env.example .env
   # fill in DISCORD_TOKEN and DISCORD_CLIENT_ID in .env
   npm start
   ```

5. **Deploy to Railway** (same as your other bot):
   - Push this folder to a GitHub repo.
   - Connect the repo in Railway.
   - Add `DISCORD_TOKEN`, `DISCORD_CLIENT_ID`, and optionally `LOG_CHANNEL_NAME` as environment variables in Railway's Variables tab.
   - Railway auto-runs `npm start`.

## What gets logged

| Category | Events |
|---|---|
| Messages | edits, deletes, bulk deletes |
| Members | joins, leaves, nickname changes, role changes, timeouts |
| Moderation | bans, unbans (with reason from audit log) |
| Server | channel create/delete/rename, role create/delete/rename/permission changes |
| Voice | join, leave, switch channels |

## Adding more events later

Drop a new file in `events/` exporting an array of `{ name, once, execute }` objects — `index.js` picks it up automatically, same pattern as your Roblox bot's `commands/` folder. Full list of available event names: https://discord.js.org/docs/packages/discord.js/main/Events:Enum

also here is the bot invite link https://discord.com/oauth2/authorize?client_id=1523638097148121259&permissions=8&integration_type=0&scope=bot+applications.commands
