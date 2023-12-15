# MotherTongues Search

This library is used for providing search functionality to a Mother Tongues Dictionary (MTD) compatible front-end.

In order to be used, the dictionary that uses this library must be using MTD compatible data. Please see [this schema](https://github.com/MotherTongues/mothertongues-UI/blob/165cc33fb6658c6e7765ed0d272d2040e39e918b/packages/schemas/mtd.json) for an exact description of the data. The data is obtained by using the [`mothertongues` package](https://github.com/MotherTongues/mothertongues) to parse and index your dictionary.

## Basic Use

Assuming you have some MTD formatted data:

```
// Import the MTDExportFormat type
import { constructSearchers, MTDExportFormat, MTDSearch, Result } from '@mothertongues/search'
// Define your data from somewhere
const mtdData: MTDExportFormat = data;
// Load your searchers
const [l1_search, l2_search] = constructSearchers(mtdData)
// Search in your dictionary's L1 language (your query will be normalized the same way as the L1 index was)
l1_search.search('this is a test') // returns Result[]
// Search in your dictionary's L2 language with an edit distance of 0 (i.e. only exact matches)
l2_search.search('this is a test', 0) // returns Result[]
```

## Local Install

To install locally, we recommend cloning the whole project:

`git clone https://github.com/MotherTongues/mothertongues.git --recursive`

Then install the UI: `cd mothertongues/mothertongues-UI && npm install`

Visit the [MotherTongues Readme](https://github.com/MotherTongues/mothertongues) for more information


## Building

Run `nx build search` to build the library.

## Running unit tests

Run `nx test search` to execute the unit tests via [Jest](https://jestjs.io).
