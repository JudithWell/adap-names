import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(other: string[], delimiter?: string) {
        if (other.length === 0) {
            throw new Error("Invalid Argument: array can't be empty!");
        }
        
        super(delimiter);
        this.components = this.components.concat(other);
    }

    getNoComponents(): number {
        return this.components.length;
    }

    getComponent(i: number): string {
        return this.components[i];
    }
    setComponent(i: number, c: string) {
        this.components[i] = c;
    }

    insert(i: number, c: string) {
        this.components.splice(i, 0, this.unescapeCharacters(c));
    }
    append(c: string) {
        this.components.push(c);
    }
    remove(i: number) {
        if (this.components.length === 0 && i === 0) {
            this.components[0] = "";
        } else {
            this.components.splice(i, 1);
        }
    }
}