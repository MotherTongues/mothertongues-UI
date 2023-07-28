import { JSONPath } from "jsonpath-plus";
import _entriesJSON from './en-fr.json';

interface File {
    filename: string,
    'mime-type': string,
    speaker?: string,
    description: string | null,
    title: string
}

export interface _Entry {
    entryID: string,
    word: string,
    compare_form?: string,
    definition: string,
    audio: File[],
    img?: File[],
    optional: {[key:string]: string},
    theme: {[key:string]: string | null}[]
}

export interface Entry extends _Entry {checked?: boolean}

export const entryIDKey = "entryID"

enum allKeys {
  word = "word",
  definition = "definition",
  exampleSentence = "example_sentence",
  exampleSentenceDefinition = "example_sentence_definition"
} 

export const L1_keys = [allKeys.word, allKeys.exampleSentence]

export const L2_keys = [allKeys.definition, allKeys.exampleSentenceDefinition]

export const priorityKeys = [allKeys.word, allKeys.definition]
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const _ENTRIES: Entry[] = _entriesJSON

export const ENTRIES_HASH: {[id: string]: Entry} = {};

export const ENTRIES: Entry[] = _ENTRIES.map((entry) => Object.assign({}, entry))

ENTRIES.forEach((entry) => {
  entry['compare_form'] = entry['word'].normalize("NFD").replace(/[\u0300-\u036f]/g, "")
  const entryID = JSONPath({path: entryIDKey, json: entry});
  ENTRIES_HASH[entryID] = entry;
})
