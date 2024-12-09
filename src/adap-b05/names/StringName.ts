import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { exec } from "child_process";

export class StringName extends AbstractName {

    protected name: string = "";
    protected noComponents: number = 0;

    constructor(source: string, delimiter?: string) {
        super(delimiter);
        this.name = source;
        if (source === "") {
            this.noComponents = 0;
        } else {
            this.noComponents = this.getMatches().length;
        }

        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.name != null && this.noComponents >= 0,
            "Failed to initialize Name."
        );
    }

    public clone(): Name {
        /* creates a new object with references to this' attributes */ 
        let copy: Name = new StringName(this.name);

        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.isEqual(copy),
            "Clone is not equal to original"
        );
        return copy;
    }

    public asString(delimiter: string = this.delimiter): string {
        return super.asString(delimiter);
    }

    public asDataString(): string {
        if (this.getDelimiterCharacter() != DEFAULT_DELIMITER) {
            return this.asDataStringWithNewDelimiter(this.delimiter, DEFAULT_DELIMITER);
        } else {
            return this.name;
        }
    }

    public isEqual(other: Name): boolean {
        return super.isEqual(other);
    }

    public getHashCode(): number {
        return super.getHashCode();
    }

    public isEmpty(): boolean {
        return super.isEmpty();
    }

    public getDelimiterCharacter(): string {
        return super.getDelimiterCharacter();
    }

    public getNoComponents(): number {
        AssertionDispatcher.dispatch(ExceptionType.CLASS_INVARIANT,
            this.noComponents >= 0, "Something went very wrong and there is a negative noComponents!"
        );

        return this.noComponents;
    }

    public getComponent(i: number): string {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            0 <= i && i < this.getNoComponents(), "Component index out of bounds!"
        );

        // get group1 text from RegExpMatchArray, which contains the component string
        return this.getMatches()[i][1];
    }

    public setComponent(i: number, c: string) {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            0 <= i && i < this.getNoComponents(), "Component index out of bounds!"
        );
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            this.isProperlyMasked(c), "new component string is not properly masked!"
        );
        let no = this.getNoComponents();

        const matches = this.getMatches();
        if (matches[i].index === undefined) {
            throw new Error("Index " + i + " not valid!");
        }
        const prev = this.name.slice(0, matches[i].index);
        const post = this.name.slice(matches[i].index + matches[i][1].length);

        this.name = prev + c + post;

        AssertionDispatcher.dispatch(ExceptionType.CLASS_INVARIANT,
            this.getMatches().length === no, "Number of components changed!"
        );
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.getComponent(i) === c, "Failed to set component!"
        );
    }

    public insert(i: number, c: string) {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            0 <= i && i < this.getNoComponents(), "Component index out of bounds!"
        );
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            this.isProperlyMasked(c), "new component string is not properly masked!"
        );
        let no = this.getNoComponents();

        const matches = this.getMatches();
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
        this.noComponents++;

        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.getNoComponents() === no + 1, "Number of components did not increase!"
        );
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.getComponent(i) === c, "Failed to insert component!"
        );
    }

    public append(c: string) {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            this.isProperlyMasked(c), "new component string is not properly masked!"
        );
        let no = this.getNoComponents();

        if (this.isEmpty()) {
            // this.name = c;
            /* @todo find a consistent way to handle single component not quite empty names */
            this.name = this.delimiter + c;
        } else {
            this.name = this.name + this.delimiter + c;
        }
        this.noComponents++;

        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.getNoComponents() === no + 1, "Number of components did not increase!"
        );
    }

    public remove(i: number) {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            0 <= i && i < this.getNoComponents(), "Component index out of bounds!"
        );
        let no = this.getNoComponents();

        const matches = this.getMatches();
        if (matches[i].index === undefined) {
            throw new Error("Index " + i + " not valid!");
        }
        let start: number;
        if (i === this.getMatches().length - 1 && matches[i].index - 1 >= 0 ) {
            // if last component is removed, make sure that previous delimiter is also deleted, if present
            start = matches[i].index - 1;
        } else {
            start = matches[i].index;
        }
        const prev = this.name.slice(0, start);
        const post = this.name.slice(matches[i].index + matches[i][0].length);
        this.name = prev + post;

        this.noComponents--;

        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.getNoComponents() === no - 1, "Number of components did not decrease!"
        );
    }

    public concat(other: Name): void {
        let no = this.getNoComponents() + other.getNoComponents();

        if (this.isEmpty()) {
            this.name = other.asString();
            this.noComponents = other.getNoComponents();
        } else if (other.isEmpty()) {
            return;
        } else {
            this.name = this.name + this.delimiter + other.asString();
            this.noComponents += other.getNoComponents();
        }

        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.getNoComponents() === no, "Concatenation failed to result in the correct number of Elements!"
        );
    }


    /** @returns an Array of RegExpMatchArrays, which contain the name components extracted by a regexp. The name component is contained in the first capturing group. */
    protected getMatches(): Array<RegExpMatchArray> {
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

    protected getComponents(): string[] {
        return this.getMatches().map(match => match[1]);
    }
}