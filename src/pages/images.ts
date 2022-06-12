import * as fs from 'fs/promises'
import sharp from 'sharp'
import { lookup } from 'mime-types'
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
        await sharp(inputBuffer).resize(400).toFile('temp.png')

        const binary = await fs.readFile('temp.png')

        return new Response(binary, {
            headers: {
                'content-type': lookup('temp.png'),
                // 'cache-control': 'max-age:360000'
            }
        })
    } catch (err) {
        console.error(err)
    }

    return {
        body: `Hello, ${params.slug}`
    }
}
