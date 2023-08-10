export interface File {
  filename: string;
  'mime-type': string;
  speaker?: string;
  description: string | null;
  title: string;
}

export interface _Entry {
  entryID: string;
  word: string;
  compare_form?: string;
  definition: string;
  audio: File[];
  img?: File[];
  optional: { [key: string]: string };
  theme: { [key: string]: string | null }[];
}

export interface Entry extends _Entry {
  checked?: boolean;
}
