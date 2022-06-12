import sharp from 'sharp'
import type { APIRoute } from 'astro'

export const get: APIRoute = async ({ request, params }) => {
    try {
        const url = new URL(request.url)
        const src = url.searchParams.get('url').replace(/^\//, '')
        
        const href = !src.startsWith('http') ? new URL(src, url.origin) : new URL(src)

        const inputRes = await fetch(href.toString())

        if (!inputRes.ok) {
            return new Response(`"${src}" not found`, { status: 404 })
        }

        const inputBuffer = Buffer.from(await inputRes.arrayBuffer())

        const result = await sharp(inputBuffer).resize(400).jpeg({ mozjpeg: true }).toBuffer()

        return new Response(result)
    } catch (err) {
        console.error(err)
    }

    return {
        body: `Hello, ${params.slug}`
    }
}