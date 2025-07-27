import { Stats } from "../api/markov.ts";

export type DS = Record<string, Record<string, Array<string>>>

export function getDS(text: string): DS {
    const tokens = text.split(/\s/)
        .filter(s => s !== '')
    if (tokens.length === 0) {
        return {}
    }
    const ds: DS = {}
    for (let i = 0; i < tokens.length - 2; i++) {
        const a = tokens[i + 0]
        const b = tokens[i + 1]
        const c = tokens[i + 2]
        if (!ds[a]) {
            ds[a] = {}
        }
        if (!ds[a][b]) {
            ds[a][b] = []
        }
        // console.log(a, b, " -> ", c)
        ds[a][b].push(c)
    }
    return ds;
}

export function getNextToken(ds: DS, prev: [string, string], stats: Stats) {
    let selection = ds[prev[0]]?.[prev[1]]
    if (!selection) {
        const r = getRandomTokenPair(ds)
        selection = ds[r[0]][r[1]]
        stats.random ++;
    }
    else {
        stats.selected ++;
    }
    const i = Math.floor(Math.random() * selection.length)
    return selection[i];
}

export function getRandomTokenPair(ds: DS) {
    const keysA = Object.keys(ds);
    const i = Math.floor(Math.random() * keysA.length)
    const firstKey = keysA[i];
    const keysB = Object.keys(ds[firstKey])
    const ii = Math.floor(Math.random() * keysB.length)
    const secondKey = keysB[ii];
    return [firstKey, secondKey]
}