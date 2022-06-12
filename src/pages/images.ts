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
        const outputBuffer = await sharp(inputBuffer).resize(400).toBuffer()

        return new Response(outputBuffer, {
            headers: {
                'content-length': Buffer.byteLength(outputBuffer).toString(),
                'content-type': lookup(src),
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

/*
export const get: APIRoute = async({ request, params }) => {
    try {
        const url = new URL(request.url)
        const src = url.searchParams.get('url').replace(/^\//, '')
        
        const href = !src.startsWith('http') ? new URL(src, url.origin) : new URL(src)

        const inputRes = await fetch(href.toString())

        if (!inputRes.ok) {
            return new Response(`"${src}" not found`, { status: 404 })
        }

        const inputBuffer = Buffer.from(await inputRes.arrayBuffer())

        const pool = new ImagePool()
        const image = pool.ingestImage(inputBuffer)

        await image.decoded

        await image.preprocess({
            resize: {
                enable: true,
                width: 400,
                height: 200
            }
        })

        await image.encode({
            mozjpeg: {},
            jxl: {
                quality: 90
            }
        })

        await pool.close()

        const outputBuffer = Buffer.from((await image.encodedWith.mozjpeg).binary)

        return new Response(outputBuffer, {
            headers: {
                'Content-Length': Buffer.byteLength(outputBuffer).toString(),
                'Content-Type': lookup(src),
                // 'Cache-Control': 'max-age=360000'
            }
        })
    } catch (err) {
        console.error(err)

        return new Response(err.toString(), { status: 500 })
    }
}*/