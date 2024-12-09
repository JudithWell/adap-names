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
            this.components != null && this.components.length >= 1,
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

    public setComponent(i: number, c: string): Name {
        IllegalArgumentException.assert(
            0 <= i && i < this.getNoComponents(),
            "Component index out of bounds!"
        );
        IllegalArgumentException.assert(
            this.isProperlyMasked(c),
            "new component is not properly masked!"
        );
        let no = this.getNoComponents();
        
        let newComponents: string[] = [];
        this.components.forEach(component => {
            newComponents.push(component);
        });
        newComponents[i] = c;
        let newName = new StringArrayName(newComponents, this.getDelimiterCharacter());

        InvalidStateException.assert(
            newName.getNoComponents() === no, "Number of components changed!"
        );
        MethodFailedException.assert(
            newName.components[i] === c, "Failed to set component!"
        );
        return newName;
    }

    protected getComponentsAsArray(): string[] {
        return this.components;
    }

    public insert(i: number, c: string): Name {
        IllegalArgumentException.assert(
            0 <= i && i < this.getNoComponents(), "Component index out of bounds!"
        );
        IllegalArgumentException.assert(
            this.isProperlyMasked(c),
            "new component is not properly masked!"
        );
        let no = this.getNoComponents();
        let prev = this.components[i];

        let newComponents: string[] = [];
        this.components.forEach(component => {
            newComponents.push(component);
        });
        newComponents.splice(i, 0, c);
        let newName: Name = new StringArrayName(newComponents, this.getDelimiterCharacter());

        MethodFailedException.assert(
            newName.getNoComponents() === no + 1, "Number of components did not increase!"
        );
        MethodFailedException.assert(
            newName.getComponent(i) === c, "Failed to insert component!"
        );
        MethodFailedException.assert(
            newName.getComponent(i+1) === prev, "Failed to shift previous element properly!"
        );
        return newName;
    }

    public append(c: string): Name {
        IllegalArgumentException.assert(
            this.isProperlyMasked(c),
            "new component is not properly masked!"
        );
        let no = this.getNoComponents();

        let newComponents: string[] = [];
        this.components.forEach(component => {
            newComponents.push(component);
        });
        if (this.isEmpty()) {
            newComponents[0] = c;
        } else {
            newComponents.push(c);
        }
        let newName: Name = new StringArrayName(newComponents, this.getDelimiterCharacter());

        MethodFailedException.assert(
            newName.getNoComponents() === no + 1, "Number of components did not increase!"
        );
        return newName;
    }

    public remove(i: number): Name {
        IllegalArgumentException.assert(
            0 <= i && i < this.getNoComponents(), "Component index out of bounds!"
        );
        
        let no = this.getNoComponents();
        
        let newComponents: string[] = [];
        this.components.forEach(component => {
            newComponents.push(component);
        });
        if (newComponents.length === 0 && i === 0) {
            newComponents[0] = "";
        } else {
            newComponents.splice(i, 1);
        }
        let newName: Name = new StringArrayName(newComponents, this.getDelimiterCharacter());

        InvalidStateException.assert(
            newName.getNoComponents() === no - 1, "Number of components did not decrease!"
        );
        return newName;
    }

    public concat(other: Name): Name {
        IllegalArgumentException.assert(
            other != null && other != undefined,
            "other is not defined or null!"
        );
        let no = this.getNoComponents() + other.getNoComponents();

        let newName = super.concat(other);

        MethodFailedException.assert(
            newName.getNoComponents() === no, 
            "Concatenation failed to result in the correct number of Elements!"
        );
        return newName;
    }
}