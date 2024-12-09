import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { MethodFailedException } from "../common/MethodFailedException";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        if (source.length === 0) {   
            this.components = [""];
        } else {
            this.components = this.components.concat(source);
        }

        MethodFailedException.assert(
            this.components != null && this.components.length > 1,
            "failed to initialize components!"
        );
    }

    public clone(): Name {
        /* creates a new object with references to this' attributes */ 
        let copy: Name = new StringArrayName(this.components);
        
        MethodFailedException.assert(
            this.isEqual(copy),
            "Clone is not equal to original"
        );
        return copy;
    }

    public asString(delimiter: string = this.delimiter): string {
        return super.asString(delimiter);
    }

    public asDataString(): string {
        return super.asDataString();
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
        if (this.components.length === 1 && this.components[0] === "") {
            return 0;
        } else {
            return this.components.length;
        }
    }

    public getComponent(i: number): string {
        IllegalArgumentException.assert(
            0 <= i && i < this.getNoComponents(),
            "Component index out of bounds!"
        );
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assert(
            0 <= i && i < this.getNoComponents(),
            "Component index out of bounds!"
        );
        IllegalArgumentException.assert(
            this.isProperlyMasked(c),
            "new component is not properly masked!"
        );
        let no = this.getNoComponents();

        this.components[i] = c;

        InvalidStateException.assert(
            this.getNoComponents() === no, "Number of components changed!"
        );
        MethodFailedException.assert(
            this.components[i] === c, "Failed to set component!"
        );
    }

    protected getComponents(): string[] {
        return this.components;
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assert(
            0 <= i && i < this.getNoComponents(), "Component index out of bounds!"
        );
        IllegalArgumentException.assert(
            this.isProperlyMasked(c),
            "new component is not properly masked!"
        );
        let no = this.getNoComponents();
        let prev = this.components[i];

        this.components.splice(i, 0, c);

        MethodFailedException.assert(
            this.getNoComponents() === no + 1, "Number of components did not increase!"
        );
        MethodFailedException.assert(
            this.components[i] === c, "Failed to insert component!"
        );
        MethodFailedException.assert(
            this.components[i+1] === prev, "Failed to shift previous element properly!"
        );
    }

    public append(c: string) {
        IllegalArgumentException.assert(
            this.isProperlyMasked(c),
            "new component is not properly masked!"
        );
        let no = this.getNoComponents();

        if (this.isEmpty()) {
            this.components[0] = c;
        } else {
            this.components.push(c);
        }

        MethodFailedException.assert(
            this.getNoComponents() === no + 1, "Number of components did not increase!"
        );
    }

    public remove(i: number) {
        IllegalArgumentException.assert(
            0 <= i && i < this.getNoComponents(), "Component index out of bounds!"
        );
        
        let no = this.getNoComponents();
        
        if (this.components.length === 0 && i === 0) {
            this.components[0] = "";
        } else {
            this.components.splice(i, 1);
        }

        InvalidStateException.assert(
            this.components.length >= 1, "Accidentally emptied entire array!"
        );
        InvalidStateException.assert(
            this.getNoComponents() === no - 1, "Number of components did not decrease!"
        );
    }

    public concat(other: Name): void {
        IllegalArgumentException.assert(
            other != null && other != undefined,
            "other is not defined or null!"
        );
        let no = this.getNoComponents() + other.getNoComponents();

        super.concat(other);

        MethodFailedException.assert(
            this.getNoComponents() === no, 
            "Concatenation failed to result in the correct number of Elements!"
        );
    }
}