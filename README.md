# PolitiBot

A twitter bot.

## Twitter API

Twitter API functionality is build using [Twit.js](https://github.com/ttezel/twit).

## Responding to Mentions

This bot listens for '@' mentions in the Twitter stream. When a mention comes through, it is analyzed using a [javascript implementation of Google's "Word2Vec" by LeeXun](https://github.com/LeeXun/word2vector). Word vectors are built from a [slimmed down, pre-trained vector library based on a Google News corpus by eyaler](https://github.com/eyaler/word2vec-slim). The slimmed down library is used because the bot lives on the smalled Digital Ocean droplet.