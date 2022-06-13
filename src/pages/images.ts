import { lookup } from 'mime-types'
import { SharpTransformer } from './_images/sharp'
import type { APIRoute } from 'astro'

export const get: APIRoute = async ({ request, params }) => {
    try {
        const url = new URL(request.url)
        const src = url.searchParams.get('src').replace(/^\//, '')
        const href = !src.startsWith('http') ? new URL(src, url.origin) : new URL(src)

        const inputRes = await fetch(href.toString())

        if (!inputRes.ok) {
            return new Response(`"${src}" not found`, { status: 404 })
        }

        let mimeType = lookup(src)

        const inputBuffer = Buffer.from(await inputRes.arrayBuffer())

        const transformer = new SharpTransformer(inputBuffer)

        if (url.searchParams.has('width') || url.searchParams.has('height')) {
            transformer.resize({
                width: parseInt(url.searchParams.get('width')),
                height: parseInt(url.searchParams.get('height'))
            })
        }

        if (url.searchParams.has('rotate')) {
            transformer.rotate(parseInt(url.searchParams.get('rotate')))
        }

        if (url.searchParams.has('flipx')) {
            transformer.flipX()
        }

        if (url.searchParams.has('flipy')) {
            transformer.flipY()
        }

        if (url.searchParams.has('blur')) {
            transformer.blur(parseInt(url.searchParams.get('blur')))
        }

        if (url.searchParams.has('format')) {
            mimeType = lookup(url.searchParams.get('format'))
            transformer.toFormat(url.searchParams.get('format') as any)
        }

        const outputBuffer = await transformer.toBuffer()

        return new Response(outputBuffer, {
            headers: {
                'content-length': Buffer.byteLength(outputBuffer).toString(),
                'content-type': mimeType,
                'cache-control': 'max-age:360000'
            }
        })
    } catch (err) {
        console.error(err)
    }

    return {
        body: `Hello, ${params.slug}`
    }
}
