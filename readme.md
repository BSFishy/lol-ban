# League Banner

League Banner is a Discord bot that automatically bans people playing League of Legends (but it can be configured to ban people playing other games too).

## Set up

### Prepare Your Environment

To prepare your environment, you will need [Node.js](https://nodejs.org/en/).
[Download and install Node.js 16.17.0](https://nodejs.org/en/download/).

Make sure you have the latest version of Yarn installed.
This can be done by opening the Command Prompt and typing the following in:

```shell
npm install -g yarn
```

### Prepare Your Workspace

Download the project files into a folder.
Open a terminal and navigate to that folder (in Windows this can be done by navigating to the folder in the File Explorer > Shift-Right Click > Open in Command Prompt).
Run the following command to install dependencies:

```shell
yarn install
```

### Configuring

Configuration is done through environment variables.
This is managed in the `.env` file.
The project comes with a [`.env.template`](./.env.template) that you can use as a template.
Simply make a duplicate of it and rename it to `.env`.

From there, you have the following options:

| Name            | Description                                                                                                                                                                                   | Default Value                                   |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------------------|
| `DISCORD_TOKEN` | The bot's access token. This can be found in Discord's developer portal                                                                                                                       | \[empty\]                                       |
| `BANNED_NAMES`  | The names of games that should be banned. This is a comma separated list and case insensitive, so you could have a list that looks like: `League of Legends, Valorant, Legends of Runeterra`. | `League of Legends`                             |
| `BAN_REASON`    | The reason to give for the ban.                                                                                                                                                               | `You aren't allowed to play League of Legends.` |

### Setting up the Discord Bot

1. [Create a bot to interact with the Discord API](https://discordapp.com/developers/applications/).
   1. Click the "New Application" button
   2. Put in the bot's information
2. Click on the "Bot" tab on the right-hand side of the screen
   1. Click the "Add Bot" button
   2. Click the "Yes, do it!" button
3. Under the "Privileged Gateway Intents" section, enable the "PRESENCE INTENT" and "SERVER MEMBERS INTENT" options
4. Disable the "PUBLIC BOT" option
5. Click on the "Reset Token" button and then click the "Yes, do it!" button
   1. Copy the token and put it into your `.env` file mentioned in the [Configuring section](#Configuring)

To invite your bot to your server, [follow this tutorial](https://discordjs.guide/preparations/adding-your-bot-to-servers.html#bot-invite-links).

### Starting the Bot

Once you have everything prepared, you can start the bot by running the following in a command line:

```shell
yarn start
```
