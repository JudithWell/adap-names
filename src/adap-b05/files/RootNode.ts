import { Exception } from "../common/Exception";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Name } from "../names/Name";
import { StringName } from "../names/StringName";
import { Directory } from "./Directory";
import { Node } from "./Node";

export class RootNode extends Directory {

    protected static ROOT_NODE: RootNode = new RootNode();

    public static getRootNode() {
        return this.ROOT_NODE;
    }

    constructor() {
        super("", new Object as Directory);
    }

    protected initialize(pn: Directory): void {
        this.parentNode = this;
    }

    public getFullName(): Name {
        return new StringName("", '/');
    }

    public move(to: Directory): void {
        // null operation
    }

    protected doSetBaseName(bn: string): void {
        // null operation
    }

    public findNodes(bn: string): Set<Node> {
        try {
            let found = new Set<Node>();
            /* Recurse to children */
            this.childNodes.forEach((child) => {
                child.findNodes(bn).forEach((node) => { found.add(node); });
            });
            this.assertClassInvariants();
            return found;
        } catch (error) {
            let trigger: Exception;
            if (error instanceof ServiceFailureException) {
                // Error has a trigger
                trigger = error.getTrigger();
            } else if (error instanceof InvalidStateException) {
                // Error will be a trigger
                trigger = error;
            } else {
                throw new ServiceFailureException("findNodes failed with an unexpected Error!");
            }
            throw new ServiceFailureException("findNodes failed encountering a Node with improper baseName!", trigger);
        }
    }

    protected isValidBaseName(bn: string): boolean {
        return bn === "";
    }

}