import { Intl } from '../index';

// json locales generator
const json_generator = new Intl({
    ext: 'json',
    filename: 'translation',
    directory: ['locales'],
    languages: ['en-US', 'id-ID', 'ar-BH', 'fr-FR', 'ja-JP'],
    baseLanguage: 'en-US',
    ignoreExists: true,
    enableSubdirectory: true,
    override: (code) => `translation_${code}`,
});
json_generator.generate();

// arb locales generator
// const arb_generator = new Intl({
//     ext: 'arb',
//     filename: 'translation',
//     directory: ['locales'],
//     languages: ['en-US', 'id-ID'],
//     baseLanguage: 'en-US',
//     enableSubdirectory: true,
//     override: (code) => `translation_${code}`,
// });
// arb_generator.generate();