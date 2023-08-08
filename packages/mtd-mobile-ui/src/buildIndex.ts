// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fflate = require('fflate');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const mtd = require("../../../dist/packages/search/src/index");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsonpath = require("jsonpath-plus");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const entries = require('./config/_entries');

const { Entry } = entries;

// eslint-disable-next-line @typescript-eslint/no-var-requires
const _entriesJSON = require('./config/en-fr.json');

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const _ENTRIES: typeof Entry[] = _entriesJSON

const ENTRIES_HASH: {[id: string]: typeof Entry} = {};

const ENTRIES: typeof Entry[] = _ENTRIES.map((entry) => Object.assign({}, entry))

enum allKeys {
  word = "word",
  definition = "definition",
  exampleSentence = "example_sentence",
  exampleSentenceDefinition = "example_sentence_definition"
} 


const L1_keys = [allKeys.word, allKeys.exampleSentence]

const L2_keys = [allKeys.definition, allKeys.exampleSentenceDefinition]

const priorityKeys = [allKeys.word, allKeys.definition]

const entryIDKey = "entryID"

ENTRIES.forEach((entry) => {
  entry['compare_form'] = entry['word'].normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  const entryID = jsonpath.JSONPath({path: entryIDKey, json: entry});
  ENTRIES_HASH[entryID] = entry;
})

function customNormalization(query: string): string {
    // Remove accents in French default
    return mtd.defaultNormalization(query).normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  }

// Build L1 index
function fileWriteCallback(err: any) {
  if (err) throw err;
  console.log('complete');
  }
const l1_index = new mtd.Index({normalizeFunction: customNormalization});
l1_index.build({entries: ENTRIES, normalizeFunction: customNormalization, entryIDIndex:entryIDKey, keys:L1_keys, priorityKeys: priorityKeys});
fs.writeFile('src/assets/l1_index.json', JSON.stringify(l1_index.data), 'utf8', fileWriteCallback);
// Build L1 compare index
const l1_compare_index = new mtd.Index({normalizeFunction: customNormalization});
l1_compare_index.build({entries: ENTRIES, normalizeFunction: customNormalization, entryIDIndex:entryIDKey, keys:L1_keys, delta: -1, priorityKeys: priorityKeys})
fs.writeFile('src/assets/l1_compare_index.json', JSON.stringify(l1_compare_index.data), 'utf8', fileWriteCallback);
// Build L2 index
const l2_index = new mtd.Index({});
l2_index.build({entries: ENTRIES, entryIDIndex:entryIDKey, keys:L2_keys, stemmerFunction: mtd.englishStemmer, priorityKeys: priorityKeys})
fs.writeFile('src/assets/l2_index.json', JSON.stringify(l2_index.data), 'utf8', fileWriteCallback);
// Write Entries Hash
fs.writeFile('src/assets/entries_hash.json', JSON.stringify(ENTRIES_HASH), 'utf8', fileWriteCallback)