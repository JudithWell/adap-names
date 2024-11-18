import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export class StringName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;
    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        this.name = other;
        if (delimiter != undefined) {
            if (delimiter.length != 1) {
                throw new Error("Delimiter has to be a single character!");                
            }
            this.delimiter = delimiter;
        }
    }

    public asString(delimiter: string = this.delimiter): string {
        let readableName = this.name;
        // replace non escaped delimiters with new delimiter:
        if (delimiter != this.delimiter) {           
            // select all delim characters that are not preceded by escape char.
            const notEscapedDelims: RegExp = this.getNotEscapedDelims(this.delimiter);
            // replace with new delimiter
            readableName = readableName.replace(notEscapedDelims, delimiter);
        }
        // replace escaped delimiters and escape chars with actual char.
        const escapeSequences: RegExp = this.getEscapeSequences(this.delimiter);
        readableName = readableName.replace(escapeSequences, (match, escapedChar) => {
            return escapedChar;
        });

        return readableName;
    }

    public asDataString(): string {
        return this.name;
    }

    public isEmpty(): boolean {
        return this.name.length === 0;
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.getComponents().length;
    }

    public getComponent(x: number): string {
        // get group1 text from RegExpMatchArray, which contains the component string
        return this.getComponents()[x][1];
    }

    public setComponent(n: number, c: string): void {
        if (n === 0) {
            if (this.isEmpty()) {
                this.name = c;
            }
            this.name = c + this.delimiter + this.name;
        } else {
            const matches = this.getComponents();
            if (matches[n].index === undefined) {
                throw new Error("Index " + n + " not valid!");
            }
            const prev = this.name.slice(0, matches[n].index);
            const post = this.name.slice(matches[n].index + matches[n][1].length);

            this.name = prev + c + post;
        }
    }

    public insert(n: number, c: string): void {
        const matches = this.getComponents();
        if (matches.length === n) {
            // append
            this.name = this.name + this.delimiter + c;
        } else {
            if (matches[n].index === undefined) {
                throw new Error("Index " + n + " not valid!");
            }
            const prev = this.name.slice(0, matches[n].index);
            const post = this.name.slice(matches[n].index);
            
            this.name = prev + c + this.delimiter + post;
        }
    }

    public append(c: string): void {
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name = this.name + this.delimiter + c;
        }
    }

    public remove(n: number): void {
        if (!this.isEmpty()) {
            const matches = this.getComponents();
            if (matches[n].index === undefined) {
                throw new Error("Index " + n + " not valid!");
            }
            let start: number;
            if (n === this.getComponents().length - 1 && matches[n].index - 1 >= 0 ) {
                // if last component is removed, make sure that previous delimiter is also deleted, if present
                start = matches[n].index - 1;
            } else {
                start = matches[n].index;
            }
            const prev = this.name.slice(0, start);
            const post = this.name.slice(matches[n].index + matches[n][0].length);
            this.name = prev + post;
        }
    }

    public concat(other: Name): void {
        if (this.isEmpty()) {
            this.name = other.asString();
        } else if (other.isEmpty()) {
            return;
        } else {
            this.name = this.name + this.delimiter + other.asString();
        }
    }

    protected escapeRegExChar(char: string): string {
        // Replaces the character char with an escaped version of the character for use in regex.
        return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /** @returns an Array of RegExpMatchArrays, which contain the name components extracted by a regexp. The name component is contained in the first capturing group. */
    protected getComponents(): Array<RegExpMatchArray> {
        return [...this.name.matchAll(this.getComponentsRegEx(this.delimiter))];
    }

    /** @returns A Regular Expression selecting all delimitier characters that are not preceded by the escape character. */
    protected getNotEscapedDelims(delimiter: string = this.delimiter): RegExp {
        const escapedEscapeChar = this.escapeRegExChar(ESCAPE_CHARACTER);
        const escapedDelimChar = this.escapeRegExChar(delimiter);
        return new RegExp(`(?<!${escapedEscapeChar})${escapedDelimChar}`, 'g');
    }

    /** @returns A Regular Expression selecting all escape sequence, e.g. sequences of ESCAPE_CHARACTER followed by an escaped character. */
    protected getEscapeSequences(delimiter: string = this.delimiter): RegExp {
        const escapedEscapeChar = this.escapeRegExChar(ESCAPE_CHARACTER);
        const escapedDelimChar = this.escapeRegExChar(delimiter);
        return new RegExp(`${escapedEscapeChar}([${escapedEscapeChar}${escapedDelimChar}])`, 'g');
    }

    // RegEx for getting components if delimiter is .:
    //   (?<=\.|^)((?:[^.\\]|\\[\\.]|\\\\[^\\.])*?)(?:\.|$)
    // Breaking down the pattern:
    // (?<=\.|^)                # Positive lookbehind for dot or start of string
    // (                        # Start of capture group 1
    //   (?:                    # Non-capturing group for the main content:
    //     [^.\\]              # Any char except dot or backslash
    //     |                   # OR
    //     \\[\\.]            # Escaped dot or escaped backslash
    //     |                   # OR
    //     \\\\[^\\.]         # Double backslash followed by any non-escape char
    //   )*?                   # Zero or more times, non-greedy
    // )                        # End of capture group 1
    // (?:\.|$)                # Ending dot or end of string
    /** @returns A RegEx that selects all components of the Name. */
    protected getComponentsRegEx(delimiter:string = this.delimiter) {
        const esc = this.escapeRegExChar(ESCAPE_CHARACTER);
        const delim = this.escapeRegExChar(delimiter);
        return new RegExp(`(?<=${delim}|^)((?:[^${esc}${delimiter}]|${esc}[${esc}${delimiter}]|${esc}${esc}[^${esc}${delimiter}])*?)(?:${delim}|$)`, 'g');
    }

}