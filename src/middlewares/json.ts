import http from 'node:http'

export async function json(req: http.IncomingMessage, _: http.ServerResponse) {
  const buffers = []

  for await (let chunk of req) {
    buffers.push(chunk)
  }

  try {
    req.body = JSON.parse(buffers.concat().toString())
  } catch {
    req.body = null
  }
}
