import { Readable, Writable, Transform, TransformCallback } from 'node:stream'

class OneToHundredStream extends Readable {
  index = 0

  _read(): void {
    const i = this.index++

    setTimeout(() => {
      if (i > 100) {
        this.push(null)
      } else {
        const buff = Buffer.from(String(i))

        this.push(buff)
      }
    }, 1000)
  }
}

class InvertNumberSignStream extends Transform {
  _transform(
    chunk: Buffer,
    _: BufferEncoding,
    callback: TransformCallback
  ): void {
    const transformed = Number(chunk.toString()) * -1

    const buff = Buffer.from(String(transformed))

    callback(null, buff)
  }
}

class MultiplyByTenStream extends Writable {
  _write(
    chunk: Buffer,
    encoding: BufferEncoding,
    callback: (error?: Error | null) => void
  ): void {
    // doesn't makes any data transformation, only processing
    console.log(Number(chunk.toString()) * 10)

    callback()
  }
}

new OneToHundredStream()
  .pipe(new InvertNumberSignStream())
  .pipe(new MultiplyByTenStream())
