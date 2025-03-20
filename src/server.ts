import http from 'node:http'
import { json } from './middlewares/json.ts'
import { routes } from './routes.ts'
import { extractQueryParams } from './utils/extract-query-params.ts'

const server = http.createServer(async (req, res) => {
  const { method, url } = req

  await json(req, res)

  const route = routes.find((route) => {
    return route.method === method && route.path.test(url!)
  })

  if (route) {
    const routeParams = url?.match(route.path)

    const { query, ...params } = routeParams?.groups ? routeParams.groups : {}

    req.params = params
    req.query = query ? extractQueryParams(query) : {}

    return route.handler(req, res)
  }

  return res.writeHead(404).end()
})

server.listen(3333, () => {
  console.log('Server is running at http://localhost:3333')
})
