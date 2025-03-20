import 'node:http'

declare module 'node:http' {
  interface IncomingMessage {
    body: {
      id?: number
      name: string
      email: string
    } | null
  }
}
