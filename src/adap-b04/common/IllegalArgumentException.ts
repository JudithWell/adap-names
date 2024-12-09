import { Exception } from "./Exception";
import { InvalidStateException } from "./InvalidStateException";

/**
 * An IllegalArgumentException signals an invalid argument.
 * In other words, a method precondition failed.
 */
export class IllegalArgumentException extends Exception {

    static assertIsNotNullOrUndefined(o: Object | null, m: string = "null or undefined", t?: Exception): void {
        this.assert(!this.isNullOrUndefined(o), m);
    }

    static assertIsSingleCharacter(c: String, exMsg: string = "string is not a single character"): void {
        this.assert(c.length === 1, exMsg);
    }
    
    public static assert(c: boolean, m: string = "illegal argument", t?: Exception): void {
        if (!c) throw new IllegalArgumentException(m, t);
    }
    
    constructor(m: string, t?: Exception) {
        super(m, t);
    }

    public getTrigger(): Exception {
        InvalidStateException.assert(this.hasTrigger());
        return super.getTrigger();
    }

}
