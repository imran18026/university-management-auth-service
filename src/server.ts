import mongoose from 'mongoose'
import app from './app'
import config from './config'
import { errorlogger, logger } from './shared/logger'
async function main() {
  try {
    await mongoose.connect(config.database_url as string)
    // console.log(` 🗄 DataBase Connected Successfully... ✔ `)
    logger.info(` 🗄 DataBase Connected Successfully... ✔ `)
    app.listen(config.port, () => {
      // console.log(`Application app listening on port: ${config.port}`)
      logger.info(`Application app listening on port: ${config.port}`)
    })
  } catch (err) {
    // console.log(` Failed to connect Database ❌`, error)
    errorlogger.error(` Failed to connect Database ❌`, err)
  }
}
main()
