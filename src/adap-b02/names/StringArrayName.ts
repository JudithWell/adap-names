import { Name, DEFAULT_DELIMITER, ESCAPE_CHARACTER } from "./Name";

export class StringArrayName implements Name {
    // All components shall be human-readable, thus not having escaped characters.
    protected components: string[] = [];
    protected delimiter: string = DEFAULT_DELIMITER;

    constructor(other: string[], delimiter?: string) {
        if (other.length === 0) {
            throw new Error("Invalid Argument: array can't be empty!");
        }
        // Append all components, assume they are masked properly
        this.components = this.components.concat(other);

        if (delimiter != undefined) {
            this.delimiter = delimiter;
        }
    }

    /**
     * Returns a human-readable representation of the Name instance using user-set control characters
     * Control characters are not escaped (creating a human-readable string)
     * Users can vary the delimiter character to be used
     */
    public asString(delimiter: string = this.delimiter): string {
        let readableComponents: string[] = [];
        // If there are escaped characters in the components, remove escape char.
        this.components.forEach((component) => {
            readableComponents.push(this.unescapeCharacters(component));
        });
        let nameString = readableComponents.join(delimiter);
        return nameString;
    }

    /** 
     * Returns a machine-readable representation of Name instance using default control characters
     * Machine-readable means that from a data string, a Name can be parsed back in
     * The control characters in the data string are the default characters
     */
    public asDataString(): string {
        // We assume that components are all already properly masked.
        let nameString = this.components.join(this.delimiter);
        return nameString;
    }

    public isEmpty(): boolean {
        return this.components.length === 0 ||
              (this.components.length === 1 && this.components[0] == "");
    }

    public getDelimiterCharacter(): string {
        return this.delimiter;
    }

    public getNoComponents(): number {
        return this.components.length;
    }

    public getComponent(i: number): string {
        return this.components[i];
    }

    public setComponent(i: number, c: string): void {
        this.components[i] = c;
    }

    public insert(i: number, c: string): void {
        this.components.splice(i, 0, this.unescapeCharacters(c));
    }

    public append(c: string): void {
        this.components.push(c);
    }

    public remove(i: number): void {
        if (this.components.length === 0 && i === 0) {
            this.components[0] = "";
        } else {
            this.components.splice(i, 1);
        }
    }

    public concat(other: Name): void {
        if (other.isEmpty()) {
            return;
        } else if (this.isEmpty() && this.components.length === 1) {
            // remove empty element when name is empty
            this.components.pop();
        }
        for (let i = 0; i < other.getNoComponents(); i++) {
            this.components.push(other.getComponent(i));
        }
    }

    protected escapeCharacters(s: string): string {
        return s.replace(this.delimiter, ESCAPE_CHARACTER + this.delimiter)
                .replace(ESCAPE_CHARACTER, ESCAPE_CHARACTER + ESCAPE_CHARACTER);
    }

    protected unescapeCharacters(s: string): string {
        return s.replace(ESCAPE_CHARACTER + this.delimiter, this.delimiter)
                .replace(ESCAPE_CHARACTER + ESCAPE_CHARACTER, ESCAPE_CHARACTER);
    }

}