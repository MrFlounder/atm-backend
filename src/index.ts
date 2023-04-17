import express from 'express'
import router from './routers/router'
import session from 'express-session'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cookieParser())

// Config session middleware
app.use(
  session({
    secret: 'dummySecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure: false,
      maxAge: 1000 * 60 * 60 * 24,
      sameSite: 'strict'
    }
  })
)

app.use(express.json())

// Mount account router
app.use('/account', router)

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})
