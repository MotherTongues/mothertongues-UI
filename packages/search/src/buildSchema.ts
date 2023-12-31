// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsonSchema = require('json-schema-to-typescript');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

// compile mtd from file
jsonSchema
  .compileFromFile('../schemas/mtd.json')
  .then((ts: any) => fs.writeFileSync('src/lib/mtd.ts', ts));
