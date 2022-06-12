import * as npath from 'path'
import sharp from 'sharp'
import type { APIRoute } from 'astro'

const inputs = Object.entries(import.meta.glob('./**/*')).reduce((acc, [key, value]) => {
    acc[key.replace('./', '')] = value
    return acc
}, {})

export const get: APIRoute = async ({ request, params }) => {
    try {
        const url = new URL(request.url)
        const src = url.searchParams.get('url').replace(/^\//, '')
        if (!(src in inputs)) {
            return new Response(`"${src}" not found`, { status: 404 })
        }
        const { default: input } = await inputs[src]()
        const inputAbs = npath.join(process.cwd(), input)

        const result = await sharp(inputAbs).resize(400).jpeg({ mozjpeg: true }).toBuffer()

        return new Response(result)
    } catch (err) {
        console.error(err)
    }

    return {
        body: `Hello, ${params.slug}`
    }
}