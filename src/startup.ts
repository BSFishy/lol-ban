import { config } from 'dotenv'

export function prepare() {
  const { error } = config({
    debug: process.env.NODE_ENV === 'development'
  })

  if (error) {
    throw error
  }

  if (!process.env.DISCORD_TOKEN) {
    throw new Error('You must set up your .env file with your Discord bot token')
  }
}
