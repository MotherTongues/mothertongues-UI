/**
 * weighted.levenstein.ts
 *
 * A simple Levenshtein distance calculator, except weighted such
 * that insertions at the beginning and deletions at the end cost less.
 *
 * AUTHOR: Pat Littell
 * AUTHOR: Converted to TypeScript Class by Aidan Pine and add specific weighting for substitutions
 * LAST UPDATED: 2023-08-10
 */

interface SubstitutionCosts {
  a_char?: { [b_char: string]: number };
}

export class DistanceCalculator {
  insertionCost: number;
  deletionCost: number;
  insertionAtBeginningCost: number;
  deletionAtEndCost: number;
  weightedSubstitutionCosts: SubstitutionCosts = {};
  defaultSubstitutionCost: number;

  constructor(
    insertionCost = 1.0,
    deletionCost = 1.0,
    insertionAtBeginningCost = 0.5,
    deletionAtEndCost = 0.5,
    substitutionCosts = {},
    defaultSubstitutionCost = 1.0
  ) {
    this.insertionCost = insertionCost;
    this.deletionCost = deletionCost;
    this.insertionAtBeginningCost = insertionAtBeginningCost;
    this.deletionAtEndCost = deletionAtEndCost;
    this.weightedSubstitutionCosts = substitutionCosts;
    this.defaultSubstitutionCost = defaultSubstitutionCost;
  }

  getSubstitutionCost(a_char: string, b_char: string) {
    if (a_char === b_char) {
      return 0;
    } else {
      return (
        this.weightedSubstitutionCosts.a_char?.[b_char] ??
        this.defaultSubstitutionCost
      );
    }
  }

  getEditDistance(a: string | string[], b: string | string[]) {
    if (a.length === 0) {
      return b.length;
    }

    if (b.length === 0) {
      return a.length;
    }

    const matrix = [];

    let currentInsertionCost = 0;
    let currentDeletionCost = 0;
    let currentSubstitutionCost = 0;

    // increment along the first column of each row
    let i;
    for (i = 0; i <= b.length; i++) {
      matrix[i] = [i * this.insertionAtBeginningCost];
    }

    // increment each column in the first row
    let j;
    for (j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (i = 1; i <= b.length; i++) {
      for (j = 1; j <= a.length; j++) {
        currentInsertionCost = matrix[i][j - 1] + this.insertionCost;
        currentSubstitutionCost =
          matrix[i - 1][j - 1] +
          this.getSubstitutionCost(a[j - 1], b[i - 1]);
        currentDeletionCost =
          matrix[i - 1][j] +
          (j == a.length ? this.deletionAtEndCost : this.deletionCost);
        matrix[i][j] = Math.min(
          currentSubstitutionCost,
          Math.min(currentInsertionCost, currentDeletionCost)
        );
      }
    }

    return matrix[b.length][a.length];
  }

  // Given a query <a> and a series of targets <bs>, return the least distance to any target
  getLeastEditDistance(a: string, bs: string[]) {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    return Math.min.apply(
      null,
      bs.map(function (b) {
        return that.getEditDistance(a, b);
      })
    );
  }
}
