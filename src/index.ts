import { markovGet, markovPost } from "./api/markov.ts";
import {resolve} from "@std/path"

const USAGE_STR = "mkc-web <static-dir> [<port>]"

const staticDirStr = Deno.args[0]
if (staticDirStr === undefined) {
    console.error(USAGE_STR)
    Deno.exit(1)
}
const STATIC_DIR = resolve(staticDirStr)
const portInput = parseInt(Deno.args[1]);
const PORT = isNaN(portInput) ? 3000 : portInput;

console.log({ PORT, STATIC_DIR })

// Helper function to serve static files
async function serveStaticFile(pathname: string): Promise<Response> {
    console.log('serve', pathname)
    const safePath = pathname //=== '/' ? '/index.html' : pathname;
    const filePath = `${STATIC_DIR}${safePath}`;
    try {
        const file = await Deno.readFile(filePath);
        return new Response(file, {
            headers: {
                'Content-Type': "text/html",
                'Access-Control-Allow-Origin': '*'
            }
        });
    } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
            console.log(`file not found (${filePath})`)
            return new Response('File not found', { status: 404 });
        }
        console.log("error reading file", error)
        return new Response('Server error', { status: 500 });
    }
}

async function handleRequest(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const method = req.method;

    // Handle preflight requests
    if (method === 'OPTIONS') {
        return new Response(null, {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        });
    }

    if (pathname === '/') {
        return serveStaticFile('/index.html')
    }

    const path = pathname.split("/")

    if (path[1] === 'api') {
        if (path[2] === 'markov') {
            if (method === "POST") {
                const body = await req.json()
                return markovPost(body)
            }
            if (method === "GET") {
                const id = pathname.split("/")[3]
                // get paragraph from id
                return markovGet(id)
            }
        }
        return new Response(null, { status: 404 })
    }

    return serveStaticFile(pathname);
}

// Graceful shutdown
Deno.addSignalListener("SIGINT", () => {
    console.log('\nShutting down server...');
    Deno.exit(0);
});

// Start the HTTP server
Deno.serve({ port: PORT }, handleRequest);
console.log(`Static files served from: ${STATIC_DIR}`);