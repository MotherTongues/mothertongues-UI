/* All other models come from @mothertongues/search */
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
