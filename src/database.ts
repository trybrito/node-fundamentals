import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

type UserType = {
  [key: string]: string
  name: string
  email: string
}

interface IDatabase {
  [key: string]: UserType[]
}

export class Database {
  #database: IDatabase = {}

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

  select(table: string, search: Record<string, string> | null) {
    let data = this.#database[table] ?? []

    if (search) {
      data = data.filter((row) => {
        return Object.entries(search).some(([key, value]) => {
          return row[key].toLowerCase().includes(value.toLocaleLowerCase())
        })
      })
    }

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

  delete(table: string, id: string) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex > -1) {
      this.#database[table].splice(rowIndex, 1)
      this.#persist()
    }
  }

  update(
    table: string,
    id: string,
    { name, email }: Pick<UserType, 'name' | 'email'>
  ) {
    const rowIndex = this.#database[table].findIndex((row) => row.id === id)

    if (rowIndex > -1) {
      this.#database[table][rowIndex] = { id, name, email }
      this.#persist()
    }
  }
}
