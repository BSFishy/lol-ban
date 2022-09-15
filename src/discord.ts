import { Client, GuildManager, GuildMemberManager, Presence, GatewayIntentBits } from 'discord.js'

const BANNED_NAMES = (process.env.BANNED_NAMES ?? 'League of Legends')
  .split(',')
  .map(name => name.trim().toLowerCase())
const BAN_REASON = process.env.BAN_REASON ?? 'You aren\'t allowed to play League of Legends.'

async function validate(presence: Presence) {
  let member = presence.member
  if (!member || !member.bannable) {
    return
  }

  const bannedActivities = presence.activities
    .filter(activity => BANNED_NAMES.includes(activity.name.toLowerCase()))

  if (bannedActivities.length <= 0) {
    return
  }

  member = await member.ban({
    reason: BAN_REASON
  })

  console.log(`Banned ${member.displayName} in ${member.guild.name}`)
}

async function validateMembers(manager: GuildMemberManager) {
  const members = await manager.fetch()

  for (const member of members.map(member => member)) {
    const presence = member.presence
    if (!presence) {
      continue
    }

    await validate(presence)
  }
}

async function validateGuilds(manager: GuildManager) {
  const guilds = await manager.fetch()

  for (const partialGuild of guilds.map(guild => guild)) {
    const guild = await partialGuild.fetch()

    await validateMembers(guild.members)
  }
}

export async function run() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildBans,
      GatewayIntentBits.GuildMembers,
      GatewayIntentBits.GuildPresences,
    ],
  })

  client.once('ready', async () => {
    await validateGuilds(client.guilds)

    console.log('Ready!')
  })

  client.on('presenceUpdate', async (_, newPresence) => {
    await validate(newPresence)
  })

  await client.login(process.env.DISCORD_TOKEN)
}
