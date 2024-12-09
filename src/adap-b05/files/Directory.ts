import { Exception } from "../common/Exception";
import { InvalidStateException } from "../common/InvalidStateException";
import { ServiceFailureException } from "../common/ServiceFailureException";
import { Node } from "./Node";

export class Directory extends Node {

    protected childNodes: Set<Node> = new Set<Node>();

    constructor(bn: string, pn: Directory) {
        super(bn, pn);
    }

    public hasChildNode(cn: Node): boolean {
        return this.childNodes.has(cn);
    }

    public addChildNode(cn: Node): void {
        this.childNodes.add(cn);
    }

    public removeChildNode(cn: Node): void {
        this.childNodes.delete(cn); // Yikes! Should have been called remove
    }

    public findNodes(bn: string): Set<Node> {
        try {
            /* Check the directorys baseName */
            let found = super.findNodes(bn);
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

}