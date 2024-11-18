import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";

export abstract class AbstractName implements Name {

    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(delimiter: string = DEFAULT_DELIMITER) {
        this.delimiter = delimiter;
    }

    public asString(delimiter: string = this.delimiter): string {
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
        return components.join(this.delimiter);
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

    public clone(): Name {
        /* creates a new object with references to this' attributes */ 
        return {...this};
    }

    public isEmpty(): boolean {
        /* TODO: Does this properly reflect [""] and "" as empty names? */
        return this.getNoComponents() === 1 && this.getComponent(0) === "";
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    abstract getNoComponents(): number;

    abstract getComponent(i: number): string;
    abstract setComponent(i: number, c: string): void;

    abstract insert(i: number, c: string): void;
    abstract append(c: string): void;
    abstract remove(i: number): void;

    public concat(other: Name): void {
        if (!other.isEmpty()) {
            let start = 0;
            if (this.isEmpty()) {
                // console.log(this.asString())
                this.setComponent(0, other.getComponent(0));
                // console.log("this is empty, so we set component 0 to " + other.getComponent(0));
                start += 1;
                // console.log(this.asString())
            }
            for (let i = start; i < other.getNoComponents(); i++) {
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