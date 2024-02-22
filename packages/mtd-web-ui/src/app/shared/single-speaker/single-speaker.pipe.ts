import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'singleSpeaker'
})
export class SingleSpeakerPipe implements PipeTransform {
  /**
   * Keeps only a single audio example per speaker
   */

  transform(value: Array<any>, ...args: any[]): Array<any> {
    const speakers = new Set();
    return value.filter(audio => {
      if (speakers.has(audio.speaker)) return false;
      speakers.add(audio.speaker);
      return true;
    });
  }
}
