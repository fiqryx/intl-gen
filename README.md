###
[![NPM Version](https://img.shields.io/npm/v/intl-gen.svg)](https://www.npmjs.org/package/intl-gen)
[![license](https://img.shields.io/npm/l/intl-gen)](https://www.npmjs.org/package/intl-gen)
[![Downloads](https://img.shields.io/npm/dt/intl-gen)](https://www.npmjs.com/package/intl-gen)

# IntlGen

`IntlGen` is a utility that automates the process of translating language files for internationalization (i18n) in your application. It reads a default language file, translates it into multiple target languages, and outputs the translated files into the specified directory structure.

<!-- ## Features

- **Automatic Translation**: Uses Google Translate API to translate language keys from the default language to other specified languages.
- **Directory Management**: Supports organized file output into subdirectories based on language codes.
- **Auto-Override**: Optionally overwrite existing translations for updating language files.
- **Customizable Filenames**: Allows customization of filenames for translated output files.
- **Regional Language Skipping**: Can skip regional language variants if desired.
- **Error Handling**: Logs unsupported languages or any errors that occur during translation. -->


## Installation

   ```bash
   npm install intl-gen
   ```

## CLI Usage

1. Create config file `intl.config.mjs`

    ```js
      /** @type {import('intl-gen').Options} */
      export const config = {
          ext: 'json',
          filename: 'translation',
          directory: ['locales'],
          languages: ['en-US', 'id-ID'],
          baseLanguage: 'en-US',
          ignoreExists: true,
          enableSubdirectory: true,
          override: (code) => `translation_${code}`,
      }
    ```

2. Execute bash command
    ```bash
    npx intl-gen -c intl.config.mjs
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