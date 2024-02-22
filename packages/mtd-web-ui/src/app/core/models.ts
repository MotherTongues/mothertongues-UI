/* FIXME: This will all get generated from pydantic soon. */

export interface ExampleAudio {
  speaker: string;
  filename: string;
  starts: Array<number>;
}

export interface ExampleText {
  text: string;
  active: boolean;
}

export interface Example {
  text: string;
  definition: Array<ExampleText>;
  audio: Array<ExampleAudio>;
}


export interface Config {
  L1: {
    name: string;
    lettersInLanguage: string[];
    compare?: string;
  };
  L2: {
    name: string;
  };
  build: string;
  // optional_field_name?: string,
  // credits?: object[],
  audio_path?: string;
  img_path?: string;
  adhoc_vars?: object[];
}

export interface DictionaryData {
  word: string;
  definition: string;
  firstWordIndex?: number;
  compare_form: string;
  sorting_form: number[];
  distance?: number;
  entryID?: string;
  favourited?: boolean;
  optional?: object[];
  theme?: string;
  secondary_theme?: string;
  img?: string;
  title?: string;
  audio?: any;
  definition_audio?: any;
  example_sentence?: any;
  example_sentence_definition?: any;
  example_sentence_audio: any;
  example_sentence_definition_audio: any;
  source?: string;
}
