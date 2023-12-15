# Mother Tongues Dictionaries UI (MTD-UI)

:construction: _This repo is under construction and could change drastically in the coming months with breaking changes._ :construction:

[![license](https://img.shields.io/github/license/MotherTongues/mothertongues-UI.svg)](LICENSE)
[![standard-readme compliant](https://img.shields.io/badge/readme%20style-standard-brightgreen.svg?style=flat-square)](https://github.com/RichardLitt/standard-readme)

MTD is an open-source tool that allow language communities and developers to quickly and inexpensively make their dictionary data digitally accessible. MTD-UI is a tool that visualizes dictionary data that is prepared with [MTD](https://github.com/MotherTongues/mothertongues).

Please visit the [website](https://www.mothertongues.org) or [docs](https://mother-tongues-dictionaries.readthedocs.io/en/latest/) for more information.

## Table of Contents

- [Background](#background)
- [Usage](#usage)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)
- [License](#license)

## Background

This is a basic [Ionic](https://ionicframework.com/) app for displaying Mother Tongues Dictionaries data. Other frontends are in development.

**Note** - Just because you _can_ make an online dictionary does _not_ mean you _should_. Before making a dictionary, you must have clear consent from the language community in order to publish a dictionary. For some background on why this is important, please read sections 1 and 2.1 [here](http://oxfordre.com/linguistics/view/10.1093/acrefore/9780199384655.001.0001/acrefore-9780199384655-e-8)

## Installation

You must have Node 16+ installed to run this app.

1. Install dependencies `npm install`
2. Serve app: `npx nx serve mtd-mobile-ui` (note you have to have some dictionary data generated from [MTD](https://github.com/MotherTongues/mothertongues) for this to work)
3. Build app: `npx nx build mtd-mobile-ui`

## Usage

In order to use MTD-UI you must have generated dictionary data from [MTD](https://github.com/MotherTongues/mothertongues).
Then, either fork or clone this repo and put the `dictionary_data.json` file in the `packages/mtd-mobile-ui/src/assets` folder. You can then run the app by running `npx nx serve mtd-mobile-ui`.

### Advanced

Part of how all MTD-UI's work is by following a statically typed format of what the data and configurations look like. If you change the type definitions in [MTD](https://github.com/MotherTongues/mothertongues) you will have to update them here as well. To do that, after you make your changes to the [Pydantic type definitions in MTD](https://github.com/MotherTongues/mothertongues/tree/main/mothertongues/config), you can export them using `mothertongues schema main packages/schemas/mtd.json`. Then run `npx nx run-many -t pre-build` to generate the TypeScript modules from the JSON schemas. You may have to update the UI and/or `search` library following these changes.

## Contributing

PRs accepted. If you would like to create more MTD-UIs those are also accepted.

## Acknowledgements

MTD-UI has had significant help from a huge number of people including but not limited to Patrick Littell, Mark Turin, & Lisa Matthewson.

As well as institutional support from the [First Peoples' Cultural Council](http://www.fpcc.ca/) and SSHRC Insight Grant 435-2016-1694, ‘Enhancing Lexical Resources for BC First Nations Languages’.

## License

[MIT © Aidan Pine.](LICENSE)
