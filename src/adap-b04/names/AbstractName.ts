import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailureException } from "../common/MethodFailureException";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        IllegalArgumentException.assertIsNotNullOrUndefined(delimiter)
        IllegalArgumentException.assertIsSingleCharacter(delimiter, "Delimiter needs to be a single character!");

        this.delimiter = delimiter;

        MethodFailureException.assertIsNotNullOrUndefined(this.delimiter)
    }

    public clone(): Name {
        /* creates a new object with references to this' attributes */ 
        let copy: Name = {...this};
        
        MethodFailureException.assertIsEqual(this, copy, "Clone is not equal to original");
        return copy;
    }

    public asString(delimiter: string = this.delimiter): string {
        IllegalArgumentException.assertIsSingleCharacter(delimiter, "Delimiter needs to be a single character!");

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
        let components: Array<string> = [];
        for (let i = 0; i < this.getNoComponents(); i++) {
            components.push(this.getComponent(i));
        }
        return components.join(DEFAULT_DELIMITER);
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
        InvalidStateException.assertIsSingleCharacter(c, "Delimiter needs to be a single character!");

        return c;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        if (!other.isEmpty()) {
            for (let i = 0; i < other.getNoComponents(); i++) {
                // console.log("Adding " + other.getComponent(i) + "  in loop...")
                this.append(other.getComponent(i))
            }
        }
    }


    /* helper functions */
    protected unescapeCharacters(s: string): string {
        return s.replace(ESCAPE_CHARACTER + this.delimiter, this.delimiter)
                .replace(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER);
    }
}