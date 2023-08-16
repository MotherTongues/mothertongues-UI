// eslint-disable-next-line @typescript-eslint/no-var-requires
const jsonSchema = require('json-schema-to-typescript')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

// compile entry from file
jsonSchema.compileFromFile('../schemas/entry.json')
  .then((ts: any) => fs.writeFileSync('src/config/entry.d.ts', ts))

// compile mtd from file
jsonSchema.compileFromFile('../schemas/mtd.json')
  .then((ts: any) => fs.writeFileSync('src/config/mtd.d.ts', ts))

// compile config from file
jsonSchema.compileFromFile('../schemas/config.json')
  .then((ts: any) => fs.writeFileSync('src/config/config.d.ts', ts))