interface File {
  filename: string;
  'mime-type': string;
  speaker?: string;
  description: string | null;
  title: string;
}

interface _Entry {
  entryID: string;
  word: string;
  compare_form?: string;
  definition: string;
  audio: File[];
  img?: File[];
  optional: { [key: string]: string };
  theme: { [key: string]: string | null }[];
}

interface Entry extends _Entry {
  checked?: boolean;
}
