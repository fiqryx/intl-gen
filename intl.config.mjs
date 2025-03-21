export const config = {
    languages: [
        { code: 'en' },
        { code: 'id' },
    ],
    directory: ['locales'],
    filename: 'translation.json',
    default_language: 'en',
    auto_override: true,
    skip_region: true,
    withoutSubdir: true,
    customResult: (code) => `translation_${code}.json`,
}