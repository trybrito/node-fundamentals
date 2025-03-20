import { IncomingMessage, ServerResponse } from 'node:http'
import { Database } from './database.ts'
import { randomUUID } from 'node:crypto'
import { buildRoutePath } from './utils/build-route-path.ts'

const database = new Database()

export const routes = [
  {
    method: 'GET',
    path: buildRoutePath('/users'),
    handler(req: IncomingMessage, res: ServerResponse) {
      const users = database.select('users')

      return res
        .setHeader('Content-type', 'application/json')
        .end(JSON.stringify(users))
    },
  },
  {
    method: 'POST',
    path: buildRoutePath('/users'),
    handler(req: IncomingMessage, res: ServerResponse) {
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
    },
  },
  {
    method: 'DELETE',
    path: buildRoutePath('/users/:id'),
    handler(req: IncomingMessage, res: ServerResponse) {
      const { id } = req.params

      database.delete('users', id)

      return res.writeHead(204).end()
    },
  },
  {
    method: 'PUT',
    path: buildRoutePath('/users/:id'),
    handler(req: IncomingMessage, res: ServerResponse) {
      const { id } = req.params
      const { name, email } = req.body

      database.update('users', id, { name, email })

      return res.writeHead(204).end()
    },
  },
]
