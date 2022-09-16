import { Client, GuildManager, GuildMemberManager, Presence, GatewayIntentBits } from 'discord.js'

// Get the list of banned names, split it into a list, and trim and lower case each name
const BANNED_NAMES = (process.env.BANNED_NAMES ?? 'League of Legends')
  .split(',')
  .map(name => name.trim().toLowerCase())

// Get the ban reason, or use the default value
const BAN_REASON = process.env.BAN_REASON ?? 'You aren\'t allowed to play League of Legends.'

/**
 * Validate a presence to make sure it is not playing a banned game.
 *
 * Only bans members that can be banned, i.e. members that have a role lower than the bot's.
 *
 * @param presence the presence to validate
 */
async function validate(presence: Presence) {
  let member = presence.member
  if (!member || !member.bannable) {
    return
  }

  // Filter the list of activities to get a list of banned activities
  const bannedActivities = presence.activities
    .filter(activity => BANNED_NAMES.includes(activity.name.toLowerCase()))

  // If the list of banned activities doesn't have at least one, the member shouldn't be banned
  if (bannedActivities.length <= 0) {
    return
  }

  // Ban the member using the given reason
  member = await member.ban({
    reason: BAN_REASON
  })

  console.log(`Banned ${member.displayName} in ${member.guild.name}`)
}

/**
 * Validate all the members of a guild using {@link validate}
 *
 * @param manager the member manager of the guild to validate
 */
async function validateMembers(manager: GuildMemberManager) {
  // Get all the members
  const members = await manager.fetch()

  // Loop through each member to validate them
  for (const member of members.map(member => member)) {
    const presence = member.presence

    // Null check the presence; this may be null if the user is offline
    if (!presence) {
      continue
    }

    // Validate the presence of the member if they have one
    await validate(presence)
  }
}

/**
 * Validate all the members of a number of guilds using {@link validateMembers}
 *
 * @param manager the guild manager to use to validate
 */
async function validateGuilds(manager: GuildManager) {
  // Get all of the guilds
  const guilds = await manager.fetch()

  // Loop through each guild to validate them
  for (const partialGuild of guilds.map(guild => guild)) {
    // Get the full guild so that its members can be validated
    const guild = await partialGuild.fetch()

    // Validate the members of the guild
    await validateMembers(guild.members)
  }
}

/**
 * Run the bot
 */
export async function run() {
  // Start the client with the necessary intents
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildPresences,
    ],
  })

  // Wait for the bot to be connected and ready to validate the guilds. This is necessary because members might already be in a banned game
  // before the bot is launched, meaning it won't be caught by the presenceUpdate event
  client.once('ready', async () => {
    // When the bot is connected, validate all the guilds
    await validateGuilds(client.guilds)

    console.log('Ready!')
  })

  // Wait for a member's presence to update
  client.on('presenceUpdate', async (_oldPresence, newPresence) => {
    // Validate the member's presence when it updates
    await validate(newPresence)
  })

  // Start the bot with the given token
  await client.login(process.env.DISCORD_TOKEN)
}
