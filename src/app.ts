import express, { Application, Request, Response } from 'express'

import cors from 'cors'
import routers from './app/routes'

const app: Application = express()

//cors
app.use(cors())
// parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// main route
app.use('/api/v1', routers)
// Test
app.get('/', (req: Request, res: Response) => {
  res.send('Test Working Successfully')
})

export default app
