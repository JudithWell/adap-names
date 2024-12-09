import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";
import { MethodFailureException } from "../common/MethodFailureException";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {
    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        if (source.length === 0) {   
            this.components = [""];
        } else {
            this.components = this.components.concat(source);
        }

        MethodFailureException.assertCondition(this.components.length > 0, "failed to create components array");
        IllegalArgumentException.assertIsNotNullOrUndefined(this.components, "components are undefined!");
    }

    public clone(): Name {
        /* creates a new object with references to this' attributes */ 
        let copy: Name = new StringArrayName(this.components);
        
        MethodFailureException.assertIsEqual(this, copy, "Clone is not equal to original");
        return copy;
    }

    public asString(delimiter?: string): string {
        return super.asString(delimiter);
    }

    public toString(): string {
        return this.asDataString();
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
        IllegalArgumentException.assertCondition(0 <= i && i < this.getNoComponents(), "Component index out of bounds!");

        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        IllegalArgumentException.assertCondition(0 <= i && i < this.getNoComponents(), "Component index out of bounds!");
        let no = this.getNoComponents();

        this.components[i] = c;    

        InvalidStateException.assertCondition(this.getNoComponents() === no, "Number of components changed!");
        MethodFailureException.assertCondition(this.components[i] === c, "Failed to set component!");
    }

    protected getComponents(): string[] {
        return this.components;
    }

    public insert(i: number, c: string) {
        IllegalArgumentException.assertCondition(0 <= i && i < this.getNoComponents(), "Component index out of bounds!");
        let no = this.getNoComponents();
        let prev = this.components[i];

        this.components.splice(i, 0, c);

        MethodFailureException.assertCondition(this.getNoComponents() === no + 1, "Number of components did not increase!");
        MethodFailureException.assertCondition(this.components[i] === c, "Failed to insert component!");
        MethodFailureException.assertCondition(this.components[i+1] === prev, "Failed to shift previous element properly!");
    }

    public append(c: string) {
        let no = this.getNoComponents();

        if (this.isEmpty()) {
            this.components[0] = c;
        } else {
            this.components.push(c);
        }

        MethodFailureException.assertCondition(this.getNoComponents() === no + 1, "Number of components did not increase!");
    }

    public remove(i: number) {
        IllegalArgumentException.assertCondition(0 <= i && i < this.getNoComponents(), "Component index out of bounds!");
        let no = this.getNoComponents();
        
        if (this.components.length === 0 && i === 0) {
            this.components[0] = "";
        } else {
            this.components.splice(i, 1);
        }

        InvalidStateException.assertCondition(this.components.length >= 1, "Accidentally emptied entire array!");
        InvalidStateException.assertCondition(this.getNoComponents() === no - 1, "Number of components did not decrease!");
    }

    public concat(other: Name): void {
        let no = this.getNoComponents() + other.getNoComponents();

        super.concat(other);

        MethodFailureException.assertCondition(this.getNoComponents() === no, "Concatenation failed to result in the correct number of Elements!");
    }
}