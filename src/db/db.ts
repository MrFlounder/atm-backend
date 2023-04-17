import { DataSource } from 'typeorm'
import dotenv from 'dotenv'
import { Transfer } from '../entities/Transfer'
import { Account } from '../entities/Account'

dotenv.config()

/*
	Typeorm datasource configuration. It picks up whatevery environment variable value you set in your .env file for required variable names
*/
const db = new DataSource({
  type: 'postgres',
  url:
    process.env.NODE_ENV === 'test'
      ? process.env.TEST_DATABASE_URI
      : process.env.DATABASE_URI,
  entities: [Account, Transfer],
  migrations: [__dirname + '/../migrations/*.ts'],
  synchronize: true
})

db.initialize()
  .then(() => {
    console.log(`Data Source has been initialized`)
  })
  .catch((err) => {
    console.error(`Data Source initialization error`, err)
  })

export default db
