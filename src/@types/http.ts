import 'node:http'

declare module 'node:http' {
  interface IncomingMessage {
    body: any | null
    params: any | null
  }
}
