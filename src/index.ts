import { prepare } from './startup'
import { run } from './discord'

prepare()
run()
  .catch(console.error)
