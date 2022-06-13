export type OutputFormat =
    | 'jpg'
    | 'jpeg'
    | 'png'
    | 'webp'
    | 'avif'

export interface ImageTransformer {
    constructor(inputBuffer: Buffer)
    resize(params: { width: number, height: number })
    rotate(degrees: number)
    flipX()
    flipY()
    blur(sigma: number)
    toFormat(format: OutputFormat, quality?: number)
    toBuffer(): Promise<Buffer>
}