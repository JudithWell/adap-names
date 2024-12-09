import { DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "../common/Printable";
import { Name } from "./Name";
import { AbstractName } from "./AbstractName";
import { AssertionDispatcher, ExceptionType } from "../common/AssertionDispatcher";

export class StringArrayName extends AbstractName {

    protected components: string[] = [];

    constructor(source: string[], delimiter?: string) {
        super(delimiter);
        if (source.length === 0) {   
            this.components = [""];
        } else {
            this.components = this.components.concat(source);
        }

        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.components != null && this.components.length > 1,
            "failed to initialize components!"
        );
    }

    public clone(): Name {
        /* creates a new object with references to this' attributes */ 
        let copy: Name = new StringArrayName(this.components);
        
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
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            0 <= i && i < this.getNoComponents(),
            "Component index out of bounds!"
        );
        return this.components[i];
    }

    public setComponent(i: number, c: string) {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            0 <= i && i < this.getNoComponents(),
            "Component index out of bounds!"
        );
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            this.isProperlyMasked(c),
            "new component is not properly masked!"
        );
        let no = this.getNoComponents();

        this.components[i] = c;

        AssertionDispatcher.dispatch(ExceptionType.CLASS_INVARIANT,
            this.getNoComponents() === no, "Number of components changed!"
        );
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.components[i] === c, "Failed to set component!"
        );
    }

    protected getComponents(): string[] {
        return this.components;
    }

    public insert(i: number, c: string) {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            0 <= i && i < this.getNoComponents(), "Component index out of bounds!"
        );
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            this.isProperlyMasked(c),
            "new component is not properly masked!"
        );
        let no = this.getNoComponents();
        let prev = this.components[i];

        this.components.splice(i, 0, c);

        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.getNoComponents() === no + 1, "Number of components did not increase!"
        );
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.components[i] === c, "Failed to insert component!"
        );
        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.components[i+1] === prev, "Failed to shift previous element properly!"
        );
    }

    public append(c: string) {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            this.isProperlyMasked(c),
            "new component is not properly masked!"
        );
        let no = this.getNoComponents();

        if (this.isEmpty()) {
            this.components[0] = c;
        } else {
            this.components.push(c);
        }

        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.getNoComponents() === no + 1, "Number of components did not increase!"
        );
    }

    public remove(i: number) {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            0 <= i && i < this.getNoComponents(), "Component index out of bounds!"
        );
        
        let no = this.getNoComponents();
        
        if (this.components.length === 0 && i === 0) {
            this.components[0] = "";
        } else {
            this.components.splice(i, 1);
        }

        AssertionDispatcher.dispatch(ExceptionType.CLASS_INVARIANT,
            this.components.length >= 1, "Accidentally emptied entire array!"
        );
        AssertionDispatcher.dispatch(ExceptionType.CLASS_INVARIANT,
            this.getNoComponents() === no - 1, "Number of components did not decrease!"
        );
    }

    public concat(other: Name): void {
        AssertionDispatcher.dispatch(ExceptionType.PRECONDITION,
            other != null && other != undefined,
            "other is not defined or null!"
        );
        let no = this.getNoComponents() + other.getNoComponents();

        super.concat(other);

        AssertionDispatcher.dispatch(ExceptionType.POSTCONDITION,
            this.getNoComponents() === no, 
            "Concatenation failed to result in the correct number of Elements!"
        );
    }
}