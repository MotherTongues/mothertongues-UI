import { JSONPath } from "jsonpath-plus";
import slugify from 'slugify';

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
} 

export const L1_keys = [allKeys.word]

export const L2_keys = [allKeys.definition]

const _ENTRIES: Entry[] = []

export const ENTRIES_HASH: {[id: string]: Entry} = {};

export const ENTRIES: Entry[] = _ENTRIES.map((entry) => Object.assign({}, entry))

ENTRIES.forEach((entry) => {
  entry['compare_form'] = slugify(entry['word'])
  const entryID = JSONPath({path: entryIDKey, json: entry});
  ENTRIES_HASH[entryID] = entry;
})