
type ResultCallback = (code: string) => string

interface Language {
    /**
     * language code ISO 639-1:2002
     */
    code: string
    /**
     * language name
     */
    title: string
}

export interface Options {
    /**
     * base directory
     */
    directory: string[]
    /**
     * list of languages
     */
    languages: Language[]
    /**
     * target filename include a direct
     */
    filename: string
    /**
     * default language
     */
    default_language: string
    /**
     * ovveride every current locale file
     */
    auto_override?: boolean
    /**
     * skip translate region language
     */
    skip_region?: boolean
    /**
     * exclude specifict langauage
     */
    exclude?: string[]
    /**
     * customize result name
     */
    customResult?: ResultCallback
    /**
     * without generate subdir
     */
    withoutSubdir?: boolean
}

export interface Encode {
    word: string
    to: string
    error: () => void
}