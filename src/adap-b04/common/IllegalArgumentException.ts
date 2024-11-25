import { Exception } from "./Exception";

/**
 * An IllegalArgumentException signals an invalid argument.
 * In other words, a method precondition failed.
 */
export class IllegalArgumentException extends Exception {

    static assertIsNotNullOrUndefined(o: Object | null, exMsg: string = "null or undefined"): void {
        this.assertCondition(!this.isNullOrUndefined(o), exMsg);
    }

    static assertIsSingleCharacter(c: String, exMsg: string = "string is not a single character"): void {
        this.assertCondition(c.length === 1, exMsg);
    }
    
    static assertCondition(cond: boolean, exMsg: string): void {
        if (!cond) throw new IllegalArgumentException(exMsg);
    }
    
    constructor(m: string) {
        super(m);
    }
    
}
