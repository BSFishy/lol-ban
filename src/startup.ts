import { config } from 'dotenv'

/**
 * Run some preliminary checks to make sure the environment is ready to run the bot
 */
export function prepare() {
  // Load process.env with the environment variables from the .env file
  const { error } = config({
    debug: process.env.NODE_ENV === 'development'
  })

  // Rethrow an error if dotenv had one
  if (error) {
    throw error
  }

  // Make sure DISCORD_TOKEN is in the environment variables, as it is needed
  if (!process.env.DISCORD_TOKEN) {
    throw new Error('You must set up your .env file with your Discord bot token')
  }
}
