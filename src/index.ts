import fs from 'fs'
import path from 'path'
import translate from "@iamtraction/google-translate"
import { logger } from './logger'

export interface Options<T extends string = string> {
    /**
     * extionsion
     */
    ext: 'arb' | 'json'
    /**
     * translation filename
     */
    filename?: string
    /**
     * languages list. format ISO 639-1:2002
     * @link https://id.wikipedia.org/wiki/ISO_639-1
     */
    languages: T[]
    /**
     * directory of translation
     */
    directory: string[]
    /**
     * base language for translate
     */
    baseLanguage: T
    /**
     * ignore translate when key is already exists
     */
    ignoreExists?: boolean
    /**
     * exclude specifict languages
     */
    exclude?: string[]
    /**
     * override output file.
     * @param code string
     * @returns string
     */
    override?: (code: string) => string
    /**
     * when `true` will be generate subdirectory by langauge code
     * @example `.../en/translation_file`
     */
    enableSubdirectory?: boolean
    /**
     * skip translate region language
     * language code must be have region like `en_US`
     */
    skipRegion?: boolean
}

interface Encode {
    word: string
    to: string
    error: () => void
}

export class Intl {
    private directory: string
    private filepath: string
    private filename: string
    private country: boolean = false

    constructor(private op: Options) {
        this.directory = path.join(process.cwd(), ...op.directory)
        this.filename = `${this.check(op.filename ?? op.baseLanguage)}.${op.ext}`;

        if (op.enableSubdirectory) {
            this.filepath = path.join(this.directory, op.baseLanguage, this.filename)
        } else {
            this.filepath = path.join(this.directory, this.filename)
        }
    }

    async generate() {
        try {
            const startTime = Date.now();

            const target = fs.readFileSync(this.filepath, { encoding: 'utf8' })
            await this.execute(JSON.parse(target))

            logger.success(`Done in ${Date.now() - startTime}ms`)
        } catch (e) {
            logger.error("Generate error:", e)
        }
    }

    private async execute(target: Record<string, string>) {
        for (const v of this.op.languages) {
            if (v !== this.op.baseLanguage && !this.op.exclude?.includes(v)) {
                try {
                    let directory = this.directory;
                    let filename = this.filename;
                    let current_object: Record<string, string> = {}

                    if (this.op.override) {
                        filename = `${this.check(this.op.override(v))}.${this.op.ext}`;
                    }

                    if (this.op.enableSubdirectory) {
                        directory = path.join(this.directory, v)
                        if (!fs.existsSync(directory)) {
                            fs.mkdirSync(directory, { recursive: true });
                        }
                    }

                    // logger.info(`Start translating: ${v}`);

                    if (this.op.ignoreExists) {
                        try {
                            current_object = JSON.parse(
                                fs.readFileSync(path.join(directory, filename), { encoding: 'utf-8' })
                            )
                        } catch (e) {
                            // logger.info(`Creating file ${filename}`);
                        }
                    }

                    const loading = logger.spinner(`Translating ${v}`).start();

                    this.country = false;
                    let unsupport = false;

                    for (const [key, value] of Object.entries(target)) {
                        if (!current_object[key]) {
                            const result = await this.encode({
                                word: value,
                                to: v,
                                error: () => {
                                    logger.warn(`Unsupport language ${v}`);
                                    unsupport = true
                                },
                            })

                            if (result) {
                                current_object[key] = result
                            }
                        }

                        if (unsupport) break;
                    }

                    for (const [key] of Object.entries(current_object)) {
                        if (!target[key]) {
                            delete current_object[key]
                        }
                    }

                    loading.succeed(`Translated done ${v}`);

                    if (Object.keys(current_object).length) {
                        fs.writeFileSync(path.join(directory, filename), JSON.stringify(current_object), {
                            flag: 'w+',
                            encoding: 'utf8'
                        });
                    }
                } catch (error) {
                    logger.error(`Translate error: ${v}`)
                }
            }
        }
    }

    /**
     * checking filename extension
     */
    private check(filename: string) {
        return filename.replace(/\.[^/.]+$/, "")
    }

    /**
     * Replace placeholders in a string.
     * Supports both {{}} and {} formats.
     */
    private replace(str: string, replace: string) {
        const placeholders: string[] = [];

        const modifiedStr = str.replace(/{{(.*?)}}|\{(.*?)\}/g, (match) => {
            placeholders.push(match);
            return replace;
        });

        return { placeholders, modifiedStr };
    }

    /**
     * encode words to target language
     */
    private async encode({ word, to, error }: Encode) {
        // Replace all placeholders with temporary markers
        const { placeholders, modifiedStr: textToTranslate } = this.replace(word, '[[]]');

        const translateToLanguage = async (regionIndex: number): Promise<string> => {
            const targetLang = to.split('-')[regionIndex].toLowerCase();
            const sourceLang = this.op.baseLanguage.split('-')[0].toLowerCase();

            const translation = await translate(textToTranslate, {
                from: sourceLang,
                to: targetLang
            });

            // Restore placeholders one by one
            return placeholders.reduce((result, placeholder) =>
                result.replace('[[]]', placeholder),
                translation.text
            );
        };

        try {
            if (this.op.skipRegion) throw "skip region";
            return await translateToLanguage(1)
        } catch (e) {
            try {
                if (!this.country && !this.op.skipRegion) {
                    this.country = true;
                }
                return await translateToLanguage(0);
            } catch (e) {
                error()
            }
        }
    }
}