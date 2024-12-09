import { Exception } from "./Exception";

/**
 * An InvalidStateException signals an invalid state of an object.
 * In other words, a class invariant failed.
 */
export class InvalidStateException extends Exception {

    static assertIsNotNullOrUndefined(o: Object | null, m: string = "null or undefined", t?: Exception): void {
        this.assert(o != null && o != undefined, m, t);
    }

    static assertIsSingleCharacter(c: String, exMsg: string = "string is not a single character"): void {
        this.assert(c.length === 1, exMsg);
    }
      
    public static assert(c: boolean, m: string = "invalid state", t?: Exception): void {
        if (!c) throw new InvalidStateException(m, t);
    }

    constructor(m: string, t?: Exception) {
        super(m, t);
    }
    
}
