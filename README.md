###
[![NPM Version](https://img.shields.io/npm/v/intl-gen.svg)](https://www.npmjs.org/package/intl-gen)
[![license](https://img.shields.io/npm/l/intl-gen)](https://www.npmjs.org/package/intl-gen)
[![Downloads](https://img.shields.io/npm/dt/intl-gen)](https://www.npmjs.com/package/intl-gen)

# IntlGen

`IntlGen` is a utility that automates the process of translating language files for internationalization (i18n) in your application. It reads a default language file, translates it into multiple target languages, and outputs the translated files into the specified directory structure.

## Features

- **Automatic Translation**: Uses Google Translate API to translate language keys from the default language to other specified languages.
- **Directory Management**: Supports organized file output into subdirectories based on language codes.
- **Auto-Override**: Optionally overwrite existing translations for updating language files.
- **Customizable Filenames**: Allows customization of filenames for translated output files.
- **Regional Language Skipping**: Can skip regional language variants if desired.
- **Error Handling**: Logs unsupported languages or any errors that occur during translation.
- **Framework supports**: Next.js, soon...


## Installation

   ```bash
   npm install intl-gen
   ```

## Usage

1. Import `IntlGen` and configure options:

    ```ts
    import IntlGen from './IntlGen';
    import { Options } from './interfaces/config';

    const options: Options = {
      directory: ['locales'], // Base directory for language files
      languages: [
        { code: 'es', title: 'Spanish' },
        { code: 'fr', title: 'French' },
        // Add more languages as needed
      ],
      filename: 'translation.json', // Name of the translation file
      default_language: 'en', // Default language code
      auto_override: true, // Override existing translations
      skip_region: false, // Skip regional variants, when a language code have region like `en_US`
      exclude: ['zh'], // Exclude Chinese language
      override_output: (code) => `translation_${code}.json`, // Override output filename
      locale_directory: true, // Organize directories by language code
    };
    ```

2. Initialize the IntlGen instance:
    ```ts
    const intlGen = new IntlGen(options);
    ```

3. Run the translation:
    ```ts
    intlGen.run();
    ```

### Options Configuration

The Options interface includes the following fields:

- directory (string[]): Array of directories where translation files are stored.
- languages (Language[]): List of languages to translate into, each with a code (ISO 639-1) and title.
- filename (string): Filename of the default language file.
- default_language (string): Language code of the base language to translate from.
- auto_override (boolean, optional): If true, overrides existing translations.
- skip_region (boolean, optional): If true, skips region-based translations.
- exclude (string[], optional): Array of language codes to exclude from translation.
- override_output (ResultCallback, optional): Function to override output filenames.
- locale_directory (boolean, optional): If true, outputs files directly by language directory.

## Example

- Structure Output Directory
  ```plaintext
  project-root/
  └── locales/
      ├── en/
      │   └── translation.json
      ├── es/
      │   └── translation_es.json
      └── fr/
          └── translation_fr.json
  ```

- Default Language File (translation.json)

  ```json
  {
    "hello": "Hello",
    "welcome": "Welcome to our application!"
  }
  ```

- Translated Output (translation_es.json)

  ```json
  {
    "hello": "Hola",
    "welcome": "¡Bienvenido a nuestra aplicación!"
  }
  ```

  `note:` It is recommended to check the results again, and correct them manually if they do not match.

## How integrate on Next.js 

1. Create file `intl-gen.ts` if use typescript or `intl-gen.js` on your `project-root` and write that
    - Typescript

      ```ts
      import IntlGen from './IntlGen';

      const intlGen = new IntlGen({
        directory: ['locales'],
        filename: 'translation.json',
        default_language: 'en',
        auto_override: true,
        skip_region: false,
        locale_directory: true,
        languages: [
          { code: 'es', title: 'Spanish' },
          { code: 'fr', title: 'French' },
          // Add more languages as needed
        ],
      });

      intlGen.run();
      ```

    - Javascript

      ```js
      const IntlGen = require('intl-gen').default


      const intlGen = new IntlGen({
        directory: ['locales'],
        filename: 'translation.json',
        default_language: 'en',
        auto_override: true,
        skip_region: false,
        locale_directory: true,
        languages: [
          { code: 'es', title: 'Spanish' },
          { code: 'fr', title: 'French' },
          // Add more languages as needed
        ],
      });

      intlGen.run();
      ```

2. Create base `translation.json` on `locales/en/`

    ```json
    {
      "hello": "Hello",
      "welcome": "Welcome to our application!"
    }
    ```

3. Edit `tsconfig.json` (skip that if not use typescript)
    ```json
    {
      ....
      "ts-node": {
        "compilerOptions": {
          "module": "CommonJS"
        }
      }
    }
    ```

4. Execute on your terminal

    - Typescript

      ```bash
      $ ts-node intl-gen.ts
      ```

    - Javascript
      ```bash
      $ node intl-gen.js
      ```