# Caching API



## Features
- [contains all metadata](./metadata/) as json file
- [listens](./src/utils/btc/mint-listen.js) to a bitcoin node for a good tx expected sats sent to the publisher addr from a minter.
- [randomly chooses metadata allocated to a minter](./src/utils/btc/select-metadata.js) to be inscribed on mint, via nois.network
- [creates and adds](./src/utils/btc/populate-metadata.js) publisher sig to metadata
- [broadcast inscription]() to BTC, using [Ordit SDK](https://sado.space/docs/sdk-introduction)
- [updates list of consumed metadata](./src/utils/btc/used-metadata.js) to prevent choosing the same metadata twice

## Requirements
- bitcoind
- redis

## Mint Inscriptions
 An insciption mint happens when the sufficient amount of sat's are sent to a publisher addr. This allows for absolute finality with associating an inscription metadata with a minter, preventing duplicate metatdata from being inscribed.

## Metadata
Metadata must be labeled in numeric order, for example `0.json`,`1.json`, `2.json` and so on.

### Format
metata files should be formatted like this:
```json
{
  "p": "vord",
  "v": 1,
  "ty": "insc",
  "col": "eb9d4726a7caaaf5a7fe082059cb37b97b188845b70f476fa9833ec3079f5600:0",
  "iid": "wiz-01",
  "publ": "1PublisherBitcoinAddress1",
  "nonce": 0,
  "sig": "HzXmUa2mXuu7kCog7B7NqSR61Oa/Tr13IixoJG6C3e3qCdKptNL0pT0wxQ8oZGz9hvgjnq4WL+pMSjsqV+lVv94="
}
```

### Consumed Metadata

## Verifiable Randomness
we utilize the [nois js library]() function to pick a random file from the metadata folder.


## Ordinal Publisher Signature


## Broadcast Transaction


## ROADMAP

### RUST IMPLEMENTATION