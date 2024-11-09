import fs from 'fs'
import path from 'path'
import translate from "@iamtraction/google-translate"
import { Encode, Options } from './interfaces/config'

class IntlGen {
    /**
     * base directory
     */
    private directory: string
    /**
     * base filepath
     */
    private filepath: string
    /**
     * checkpoint country language
     */
    private country: boolean = false

    constructor(private op: Options) {
        this.directory = path.join(process.cwd(), ...op.directory)
        if (this.op.withoutSubdir) {
            this.filepath = path.join(this.directory, op.filename)
        } else {
            this.filepath = path.join(this.directory, op.default_language, op.filename)
        }
    }

    async run() {
        try {
            const target = fs.readFileSync(this.filepath, { encoding: 'utf8' })
            await this.generate(JSON.parse(target))
        } catch (e) {
            console.error("initalize failed:", e)
        }
    }

    private async generate(target: Record<string, string>) {
        for (const v of this.op.languages) {
            if (v.code !== this.op.default_language && !this.op.exclude?.includes(v.code)) {
                try {
                    let filename = this.op.filename;
                    if (this.op.customResult) {
                        filename = this.op.customResult(v.code);
                    }

                    let directory = this.directory;
                    if (!this.op.withoutSubdir) {
                        directory = path.join(this.directory, v.code)
                        if (!fs.existsSync(directory)) {
                            fs.mkdirSync(directory, { recursive: true });
                            console.log(`creating directory:`, v.code);
                        }
                    }

                    console.log('start_translation:', v.code);
                    console.time(`translation_time[${v.code}]`);

                    let current_object: Record<string, string> = {}
                    if (this.op.auto_override) {
                        try {
                            current_object = JSON.parse(fs.readFileSync(path.join(directory, filename), {
                                encoding: 'utf-8'
                            }))
                        } catch (e) {
                            console.log("creating new file:", v.code);
                        }
                    }

                    this.country = false;
                    let unsupport = false;
                    for (const [key, value] of Object.entries(target)) {
                        if (!current_object[key]) {
                            const result = await this.encode({
                                word: value,
                                to: v.code,
                                error: () => {
                                    console.log("unsupport_language:", v.code);
                                    unsupport = true
                                },
                            })

                            if (result) {
                                current_object[key] = result
                            }
                        }

                        if (unsupport) break;
                    }

                    // remove not use key
                    for (const [key] of Object.entries(current_object)) {
                        if (!target[key]) {
                            delete current_object[key]
                        }
                    }

                    // Write file
                    if (Object.keys(current_object).length) {
                        fs.writeFileSync(path.join(directory, filename), JSON.stringify(current_object), {
                            flag: 'w+',
                            encoding: 'utf8'
                        });
                        console.timeEnd(`translation_time[${v.code}]`);
                    }
                } catch (e) {
                    console.log("error_generate:", v.code);
                }
            }
        }
    }

    /**
     * Replace placeholders in a string.
     * Supports both {{}} and {} formats.
     */
    private replace(str: string, replace: any) {
        let placeholder = "";
        str = str.replace(/{{(.*?)}}|\{(.*?)\}/g, (match) => {
            placeholder = match;
            return replace;
        });
        return [placeholder, str];
    }

    /**
     * encode words to target language
     */
    private async encode({ word, to, error }: Encode) {
        const [placeholder, replaced_word] = this.replace(word, "{{}}")
        const result = async (index: number) => {
            const res = await translate(replaced_word, {
                from: this.op.default_language.split('-')[0].toLowerCase(),
                to: to.split('-')[index].toLowerCase()
            })
            return res.text.replace("{{}}", placeholder)
        }

        try {
            if (this.op.skip_region) throw "skip region";
            return await result(1)
        } catch (e) {
            try {
                if (!this.country && !this.op.skip_region) {
                    this.country = true
                    console.log('trying country language:', to.split('-')[0]);
                }
                return await result(0);
            } catch (e) {
                error()
            }
        }
    }
}

export default IntlGen