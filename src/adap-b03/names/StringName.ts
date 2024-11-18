import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(other: string, delimiter?: string) {
        super(delimiter);
        this.name = other;
        
    }

    getNoComponents(): number {
        return this.getComponents().length;
    }

    getComponent(i: number): string {
        // get group1 text from RegExpMatchArray, which contains the component string
        return this.getComponents()[i][1];
    }
    setComponent(i: number, c: string) {
        if (i === 0) {
            if (this.isEmpty()) {
                this.name = c;
            }
            this.name = c + this.delimiter + this.name;
        } else {
            const matches = this.getComponents();
            if (matches[i].index === undefined) {
                throw new Error("Index " + i + " not valid!");
            }
            const prev = this.name.slice(0, matches[i].index);
            const post = this.name.slice(matches[i].index + matches[i][1].length);

            this.name = prev + c + post;
        }
    }

    insert(i: number, c: string) {
        const matches = this.getComponents();
        if (matches.length === i) {
            // append
            this.name = this.name + this.delimiter + c;
        } else {
            if (matches[i].index === undefined) {
                throw new Error("Index " + i + " not valid!");
            }
            const prev = this.name.slice(0, matches[i].index);
            const post = this.name.slice(matches[i].index);
            
            this.name = prev + c + this.delimiter + post;
        }
    }
    append(c: string) {
        if (this.isEmpty()) {
            this.name = c;
        } else {
            this.name = this.name + this.delimiter + c;
        }
    }
    remove(i: number) {
        if (!this.isEmpty()) {
            const matches = this.getComponents();
            if (matches[i].index === undefined) {
                throw new Error("Index " + i + " not valid!");
            }
            let start: number;
            if (i === this.getComponents().length - 1 && matches[i].index - 1 >= 0 ) {
                // if last component is removed, make sure that previous delimiter is also deleted, if present
                start = matches[i].index - 1;
            } else {
                start = matches[i].index;
            }
            const prev = this.name.slice(0, start);
            const post = this.name.slice(matches[i].index + matches[i][0].length);
            this.name = prev + post;
        }
    }

    concat(other: Name): void {
        if (this.isEmpty()) {
            this.name = other.asString();
        } else if (other.isEmpty()) {
            return;
        } else {
            this.name = this.name + this.delimiter + other.asString();
        }
    }


    /** @returns an Array of RegExpMatchArrays, which contain the name components extracted by a regexp. The name component is contained in the first capturing group. */
    protected getComponents(): Array<RegExpMatchArray> {
        return [...this.name.matchAll(this.getComponentsRegEx(this.delimiter))];
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

    protected escapeRegExChar(char: string): string {
        // Replaces the character char with an escaped version of the character for use in regex.
        return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

}