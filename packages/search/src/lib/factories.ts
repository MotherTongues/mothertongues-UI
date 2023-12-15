// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import { Builder } from 'liblevenshtein';
import { Index, MTDSearch } from './search';
import {
  MTDExportFormat,
  SearchAlgorithms,
  WeightedLevensteinConfig,
} from './mtd';
import { DistanceCalculator } from './weighted.levenstein';

export enum TransducerAlgorithmTypes {
  standard = 'standard',
  merge_and_split = 'merge_and_split',
  transposition = 'transposition',
}

export interface BuilderConstructionParams {
  terms: Index | string[];
  algorithm?: TransducerAlgorithmTypes;
  sort_candidates?: boolean;
  case_insensitive_sort?: boolean;
  include_distance?: boolean;
  maximum_candidates?: number;
}

export function returnTransducer(
  searchType: SearchAlgorithms,
  index: Index,
  config: WeightedLevensteinConfig | undefined
) {
  let transducer = null;
  if (searchType === 'liblevenstein_automata') {
    transducer = constructTransducer({ terms: index });
  } else if (searchType === 'weighted_levenstein') {
    if (config) {
      transducer = new DistanceCalculator(config);
    } else {
      transducer = new DistanceCalculator({});
    }
  }
  return transducer;
}

export function constructTransducer({
  terms,
  algorithm = TransducerAlgorithmTypes.standard,
  sort_candidates = true,
  case_insensitive_sort = true,
  include_distance = true,
  maximum_candidates = 10,
}: BuilderConstructionParams) {
  if (!Array.isArray(terms)) {
    terms = Object.keys(terms.data);
  }
  const builder = new Builder()
    .dictionary(terms, false) // generate spelling candidates from unsorted completion_list
    .algorithm(algorithm) // use Levenshtein distance extended with transposition
    .sort_candidates(sort_candidates) // sort the spelling candidates before returning them
    .case_insensitive_sort(case_insensitive_sort) // ignore character-casing while sorting terms
    .include_distance(include_distance) // keep distances
    .maximum_candidates(maximum_candidates); // maximum number of candidates
  return builder.build();
}

export function constructSearchers(
  mtdExportFormat: MTDExportFormat
): MTDSearch[] {
  // Load L1 Index
  const l1_index = new Index({
    normalizeFunctionConfig: mtdExportFormat.config.l1_normalization_transducer,
    stemmerFunctionChoice: mtdExportFormat.config.l1_stemmer,
    data: mtdExportFormat.l1_index,
  });
  // Create L1 Search Transducer
  const l1_transducer = returnTransducer(
    mtdExportFormat.config.l1_search_strategy ?? 'liblevenstein_automata',
    l1_index,
    mtdExportFormat.config.l1_search_config ?? undefined
  );
  // Create L1 Search Object
  const l1_search = new MTDSearch({
    transducer: l1_transducer,
    index: l1_index,
    searchType:
      mtdExportFormat.config.l1_search_strategy ?? 'liblevenstein_automata',
    tokens: mtdExportFormat.config.alphabet,
  });
  // Load L2 Index
  const l2_index = new Index({
    normalizeFunctionConfig: mtdExportFormat.config.l2_normalization_transducer,
    stemmerFunctionChoice: mtdExportFormat.config.l2_stemmer,
    data: mtdExportFormat.l2_index,
  });
  // Create L2 Search Transducer
  const l2_transducer = returnTransducer(
    mtdExportFormat.config.l2_search_strategy ?? 'liblevenstein_automata',
    l2_index,
    mtdExportFormat.config.l2_search_config ?? undefined
  );
  // Create L2 Search Object
  const l2_search = new MTDSearch({
    transducer: l2_transducer,
    index: l2_index,
    searchType:
      mtdExportFormat.config.l2_search_strategy ?? 'liblevenstein_automata',
    tokens: mtdExportFormat.config.alphabet, // TODO: This isn't really right, not sure how we should tokenize though
  });
  return [l1_search, l2_search];
}
