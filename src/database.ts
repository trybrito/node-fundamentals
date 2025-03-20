import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database: Record<string, any> = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8')
      .then((data) => (this.#database = JSON.parse(data)))
      .catch(() => {
        this.#persist()
      })
  }

  #persist() {
    fs.writeFile(databasePath, JSON.stringify(this.#database))
  }

  select(table: string) {
    const data = this.#database[table] ?? []

    return data
  }

  insert(table: string, data: any) {
    if (Array.isArray(this.#database[table])) {
      this.#database[table].push(data)
    } else {
      this.#database[table] = [data]
    }

    this.#persist()

    return data
  }
}
