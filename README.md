# Basic markov chain demo

Provide a URL to get given back some similar but not identical text.

## Run 

This project is built with Deno. Run with:

    deno --allow-net --allow-read --allow-env src/index.ts

I used the [Wikipedia page on Hergé][1] for testing.

[1]: https://en.wikipedia.org/wiki/Hergé

## TODO
 
 - An option to recursively visit links - currently the output often includes sentences verbatim from the input. I suspect with only one webpage, there is often only one word that comes after a pair of given words. Giving lot more data by traversing recursively would be great.
 - It may be nice to separate words from grammar, to also give more variety, although this does seem like it would be a massive can of worms.
 - Really could do with a touch of paint.

## Why

I got interested in markov chains after learning about them over a weekend, and as they really are simple to implement I thought I'd do it. What I got done leaves a lot to be desired though - the actual markov chain part is so simple it feels like 99% of my time went towards the web app part.