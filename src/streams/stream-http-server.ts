import http from 'node:http'
import { Transform, TransformCallback } from 'node:stream'

class InvertNumberSignStream extends Transform {
  _transform(
    chunk: Buffer,
    _: BufferEncoding,
    callback: TransformCallback
  ): void {
    const transformed = Number(chunk.toString()) * -1

    console.log(transformed)

    const buff = Buffer.from(String(transformed))

    callback(null, buff)
  }
}

// req -> Readable Stream
// res -> Writable Stream

const server = http.createServer(async (req, res) => {
  // Connection stay opened as we receive inputs
  const buffers = []

  for await (let chunk of req) {
    // for get the complete stream and, then, manipulate/show its content
    buffers.push(chunk)
  }

  const fullStreamContent = buffers.concat().toString()

  return res.end(fullStreamContent)
})

server.listen(3334, () => {
  console.log('Server is running at http://localhost:3334')
})
