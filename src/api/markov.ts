import { getDS, getNextToken, getRandomTokenPair } from "../algo/algo.ts";
import type { DS } from "../algo/algo.ts";
import { Readability } from '@mozilla/readability';
import {JSDOM} from 'jsdom'

const INVLAID_URL_RESPONSE = JSON.stringify({ errorMessage: "Invalid URL" })
export type Stats = {
    random: number,
    selected: number,
}

const dsStore: Record<string, DS> = {}
export function markovGet(id: string) {
    const ds = dsStore[id];
    if (!ds) {
        return new Response(null, { status: 404 })
    }
    const stats: Stats = { random: 0, selected: 0 };

    const paragraph = getRandomTokenPair(ds);
    for (let i = 0; i < 100; i++) {
        const latest = paragraph.slice(paragraph.length - 2) as [string, string]
        const next = getNextToken(ds, latest, stats)
        paragraph.push(next)
    }

    console.log("stats: ", stats)

    return new Response(JSON.stringify({ p: paragraph.join(" ") }))
}

export async function markovPost(body: unknown): Promise<Response> {
    console.log("process markov post")
    if (body === null || typeof body !== "object") {
        console.log("err: invalid body")
        return new Response(null, { status: 400 })
    }
    if (!("url" in body) || typeof body.url !== "string") {
        console.log("err: no url string in body", body)
        return new Response(null, { status: 400 })
    }

    let url;
    try {
        url = new URL(body.url);
    }
    catch (e) {
        return new Response(INVLAID_URL_RESPONSE, { status: 400 })
    }

    let html;
    try {
        const res = await fetch(url)
        html = await res.text()
    }
    catch (e) {
        console.log("error fetching the document", e)
        return new Response(null, { status: 500 })
    }

    try {
        const text = getDocumentText(html)
        const ds = getDS(text)
        const id = crypto.randomUUID()
        dsStore[id] = ds;
        return new Response(JSON.stringify({ id }), { status: 200 })
    }
    catch (e) {
        console.log("Error processing document response", e)
        return new Response(null, { status: 500 })
    }
}


function getDocumentText(html: string): string {
    const doc = new JSDOM(html);
    const reader = new Readability(doc.window.document);
    const article = reader.parse();
    return article?.textContent ?? ""
}