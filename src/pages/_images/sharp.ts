import sharp from 'sharp'
import type { ImageTransformer, OutputFormat } from './types'

export class SharpTransformer implements ImageTransformer {
    #sharp: any

    constructor(inputBuffer: Buffer) {
        this.#sharp = sharp(inputBuffer)
    }

    resize({ width, height }: { width: number, height: number }) {
        this.#sharp.resize({ width, height })
    }

    rotate(degrees) {
        this.#sharp.rotate(degrees)
    }

    flipX() {
        this.#sharp.flop()
    }

    flipY() {
        this.#sharp.flip()
    }

    blur(sigma: number) {
        this.#sharp.blur(sigma)
    }

    toFormat(format: OutputFormat, quality = 80) {
        switch (format) {
            case 'jpg':
            case 'jpeg':
                this.#sharp.jpg({ quality })
                break
            case 'png':
                this.#sharp.png({ quality })
                break
            case 'webp':
                this.#sharp.webp({ quality })
                break
            case 'avif':
                this.#sharp.avif({ quality })
                break
            default:
                throw new Error(`"${format}" output format not supported`)
        }
    }

    toBuffer() {
        return this.#sharp.toBuffer()
    }
}