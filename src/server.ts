import http from 'node:http'
import { Database } from './database.js'
import { randomUUID } from 'node:crypto'
import { json } from './middlewares/json.ts'

type Users = {
  id: number
  name: string
  email: string
}[]

const database = new Database()

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  if (method === 'GET' && url === '/users') {
    const users = database.select('users')

    return res
      .setHeader('Content-type', 'application/json')
      .end(JSON.stringify(users))
  }

  if (method === 'POST' && url === '/users') {
    if (req.body) {
      const { name, email } = req.body

      const user = {
        id: randomUUID(),
        name,
        email,
      }

      database.insert('users', user)

      return res.writeHead(201).end()
    }

    return res.writeHead(400).end()
  }

  return res.writeHead(404).end()
})

server.listen(3333, () => {
  console.log('Server is running at http://localhost:3333')
})
