import http from 'node:http'
import { Database } from './database.ts'
import { randomUUID } from 'node:crypto'
import { json } from './middlewares/json.ts'
import { routes } from './routes.ts'

type Users = {
  id: number
  name: string
  email: string
}[]

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url!)
  })

  if (route) {
    const routeParams = url?.match(route.path)
    req.params = { ...routeParams?.groups }

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333, () => {
  console.log('Server is running at http://localhost:3333')
})
