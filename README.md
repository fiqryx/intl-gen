# IntlGen

`IntlGen` is a utility that automates the process of translating language files for internationalization (i18n) in your application. It reads a default language file, translates it into multiple target languages, and outputs the translated files into the specified directory structure.

## Features

- **Automatic Translation**: Uses Google Translate API to translate language keys from the default language to other specified languages.
- **Directory Management**: Supports organized file output into subdirectories based on language codes.
- **Auto-Override**: Optionally overwrite existing translations for updating language files.
- **Customizable Filenames**: Allows customization of filenames for translated output files.
- **Regional Language Skipping**: Can skip regional language variants if desired.
- **Error Handling**: Logs unsupported languages or any errors that occur during translation.

## Installation

1. Clone this repository.
2. Install dependencies:

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

## License

This project is licensed under the MIT License.
```plaintext
This README now includes the full usage section and configuration details. 
Save it as `README.md` in your project directory for documentation.
```