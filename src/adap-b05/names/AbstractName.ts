import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION, 
            delimiter != undefined && delimiter != null,
            "delimiter was undefined or null!"
        );
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            delimiter.length == 1,
            "delimiter is required to have length 1!"
        );
        
        this.delimiter = delimiter;

        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.delimiter != undefined && this.delimiter != null,
            "failed to initialize delimiter"
        );
    }

    public clone(): Name {
        /* creates a new object with references to this' attributes */ 
        let copy: Name = {...this};
        
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.isEqual(copy),
            "Clone is not equal to original"
        );
        return copy;
    }

    public asString(delimiter: string = this.delimiter): string {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            delimiter != null && delimiter.length == 1,
            "delimiter is required to have length 1!"
        );

        let readableComponents: string[] = [];
        // If there are escaped characters in the components, remove escape char.
        for (let i = 0; i < this.getNoComponents(); i++) {
            readableComponents.push(this.unescapeCharacters(this.getComponent(i)));
        }
        let nameString = readableComponents.join(delimiter);
        return nameString;
    }

    public toString(): string {
        return this.asDataString();
    }

    public asDataString(): string {
        if (this.getDelimiterCharacter() != DEFAULT_DELIMITER) {
            return this.asDataStringWithNewDelimiter(this.delimiter, DEFAULT_DELIMITER);
        } else {
            return this.getComponents().join(DEFAULT_DELIMITER);
        }
    }

    public isEqual(other: Name): boolean {
        // Uses hashcode for comparison
        return this.getHashCode() === other.getHashCode();
    }

    public getHashCode(): number {
        // Use hashcode function from ADAP B01
        // Slight adjustment: characters should be about 7 bits long. (Assuming ASCII encoding of components.)
        let hashCode: number = 0;
        const s: string = this.asDataString(); 
        for (let i = 0; i < s.length; i++) {
            let c = s.charCodeAt(i);
            hashCode = (hashCode << 7) - hashCode + c; 
            hashCode |= 0;
        }
        return hashCode;
    }

    public isEmpty(): boolean {
        return this.getNoComponents() === 0;
    }

    public getDelimiterCharacter(): string {
        let c = this.delimiter;
        
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            c != null && c.length == 1,
            "delimiter has invalid state!"
        );
        return c;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        const thisLength = this.getNoComponents(), otherLength = other.getNoComponents();

        if (!other.isEmpty()) {
            for (let i = 0; i < otherLength; i++) {
                // console.log("Adding " + other.getComponent(i) + "  in loop...")
                this.append(other.getComponent(i))
            }
        }

        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.getNoComponents() === thisLength + otherLength
        );
    }

    /* Way to access components as an array. */
    protected abstract getComponents(): string[];


    /* helper functions */
    protected unescapeCharacters(s: string): string {
        return s.replace(ESCAPE_CHARACTER + this.delimiter, this.delimiter)
                .replace(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER);
    }

    protected escapeRegExChar(char: string): string {
        // Replaces the character char with an escaped version of the character for use in regex.
        return char.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
    protected isProperlyMasked(component: string): boolean {
        return !(new RegExp(`(?<!\\\\)(?:\\\\\\\\)*${this.escapeRegExChar(this.delimiter)}`)).test(component);
    }

    /**
     * Does four steps:
     * - Splits the string into components
     * - unescapes all escaped prevDelimiter occurrences
     * - escapes all unescaped occurrences of newDelimiter
     * - joins the components with the new delimiter
     * @param prevDelimiter 
     * @param newDelimiter 
     */
    protected asDataStringWithNewDelimiter(prevDelimiter: string, newDelimiter: string) {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            prevDelimiter != null && newDelimiter != null,
            "Delimiter arguments must be non-null!"
        );
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            prevDelimiter.length === 1 && newDelimiter.length === 1 && prevDelimiter != newDelimiter,
            "Delimiters need to be single characters and different!"
        );

        /* Step1: Should get all components without delims (capture group1) from the list of matches */
        const components = this.getComponents();

        /* Step2: Unescape all prevDelims */
        const unescapedComponents = components.map(component => {
            /* Group 1 holds all the escaped escape characters */
            return component.replace(new RegExp(`(?<!\\\\)(\\\\\\\\)*\\\\${this.escapeRegExChar(prevDelimiter)}`, 'g'), `$1${prevDelimiter}`)
        });

        /* Step3: Reescape newDelims in components */
        const reescapedComponents = unescapedComponents.map(component => {
            return component.replace(new RegExp(`(\\\\\\\\)*${this.escapeRegExChar(newDelimiter)}`, 'g'), `$1${ESCAPE_CHARACTER}${newDelimiter}`);
        });

        /* Step4: Rebuild the name */
        return reescapedComponents.join(newDelimiter);
    }
}