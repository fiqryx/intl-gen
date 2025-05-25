import chalk from 'chalk';
import cliSpinners from 'cli-spinners';

class Spinner {
    private interval: NodeJS.Timeout | null = null;
    private frames: string[];
    private i: number = 0;
    private text: string;
    private spinnerType: cliSpinners.Spinner;

    constructor(text: string, spinnerType: cliSpinners.SpinnerName = 'dots') {
        this.text = text;
        this.spinnerType = cliSpinners[spinnerType];
        this.frames = this.spinnerType.frames;
    }

    start() {
        process.stdout.write(chalk.yellow(this.text));
        this.interval = setInterval(() => {
            process.stdout.write(`\r${chalk.yellow(this.frames[this.i++])} ${this.text}`);
            this.i %= this.frames.length;
        }, this.spinnerType.interval);
        return this;
    }

    updateText(newText: string) {
        this.text = newText;
    }

    succeed(message?: string) {
        this.stop();
        process.stdout.write(`\r${chalk.green('✓')} ${message || this.text}\n`);
    }

    fail(message?: string) {
        this.stop();
        process.stdout.write(`\r${chalk.red('✗')} ${message || this.text}\n`);
    }

    warn(message?: string) {
        this.stop();
        process.stdout.write(`\r${chalk.yellow('⚠')} ${message || this.text}\n`);
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }
}

export const logger = {
    error(...args: unknown[]) {
        console.log(chalk.red(...args));
    },
    warn(...args: unknown[]) {
        console.log(chalk.yellow(...args));
    },
    info(...args: unknown[]) {
        console.log(chalk.cyan(...args));
    },
    success(...args: unknown[]) {
        console.log(chalk.green(...args));
    },
    spinner(text: string, spinnerType?: cliSpinners.SpinnerName) {
        return new Spinner(text, spinnerType);
    }
};