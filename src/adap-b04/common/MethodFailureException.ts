import { Equality } from "./Equality";
import { Exception } from "./Exception";

/**
 * A MethodFailureException signals that the method failed to provide its service.
 * In other words, a postcondition failed.
 */
export class MethodFailureException extends Exception {

    static assertIsNotNullOrUndefined(o: Object | null, exMsg: string = "null or undefined"): void {
        this.assert(o != null && o != undefined, exMsg);
    }

    static assertIsEqual(o1: Equality, o2: Equality, exMsg: string = "not equal") {
        this.assert(o1.isEqual(o2), exMsg);
    }
    
    static assert(cond: boolean, exMsg: string): void {
        if (!cond) throw new MethodFailureException(exMsg);
    }

    constructor(m: string) {
        super(m);
    }
    
}
