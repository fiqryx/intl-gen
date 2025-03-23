/** @type {import('./src/index').Options} */
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