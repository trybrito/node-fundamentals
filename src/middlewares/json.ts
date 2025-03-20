import { IncomingMessage, ServerResponse } from 'node:http'

export async function json(req: IncomingMessage, _: ServerResponse) {
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
