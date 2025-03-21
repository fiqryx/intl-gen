
type ResultCallback = (code: string) => string

interface Language {
    /**
     * language code ISO 639-1:2002
     */
    code: string
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
     * language code must be have region like `en_US`
     */
    skip_region?: boolean
    /**
     * exclude specifict langauage
     */
    exclude?: string[]
    /**
     * customize result name
     * @deprecated
     */
    customResult?: ResultCallback
    /**
     * override output filename
     */
    override_output?: ResultCallback
    /**
     * without generate subdir
     * @deprecated
     */
    withoutSubdir?: boolean
    /**
     * organize directories by language code
     */
    locale_directory?: boolean
}

export interface Encode {
    word: string
    to: string
    error: () => void
}