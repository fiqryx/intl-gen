import IntlGen from "../intl-gen";

// json locales generator
const json_generator = new IntlGen({
    languages: require('../../locales/languages.json'),
    directory: ['locales'],
    filename: 'translation.json',
    default_language: 'en-US',
    auto_override: true,
    skip_region: true
});
// json_generator.run();

// arb locales generator
const arb_generator = new IntlGen({
    languages: require('../../l10n/languages.json'),
    filename: 'intl_en.arb',
    default_language: 'en',
    directory: ['l10n'],
    auto_override: true,
    skip_region: true,
    withoutSubdir: true,
    customResult: (code) => `intl_${code}.arb`,
});
// arb_generator.run();