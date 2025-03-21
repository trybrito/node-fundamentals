import { Readable } from 'node:stream'

class OneToHundredStream extends Readable {
  index = 1

  _read(): void {
    const i = this.index++

    setTimeout(() => {
      if (i > 5) {
        // 5 for test
        this.push(null)
      } else {
        const buff = Buffer.from(String(i))

        this.push(buff)
      }
    }, 1000)
  }
}

fetch('http://localhost:3334', {
  method: 'POST',
  body: new OneToHundredStream(),
  duplex: 'half',
})
  .then((response) => response.text())
  .then((data) => console.log(data))
