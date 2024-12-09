import { IllegalArgumentException } from "../common/IllegalArgumentException";
import { InvalidStateException } from "../common/InvalidStateException";

import { Name } from "../names/Name";
import { Directory } from "./Directory";

export class Node {

    protected baseName: string = "";
    protected parentNode: Directory;

    constructor(bn: string, pn: Directory) {
        this.doSetBaseName(bn);
        this.parentNode = pn; // why oh why do I have to set this
        this.initialize(pn);
        console.log("Added Node "+ this.getBaseName() +"");
    }

    protected initialize(pn: Directory): void {
        this.parentNode = pn;
        this.parentNode.addChildNode(this);
    }

    public move(to: Directory): void {
        this.parentNode.removeChildNode(this);
        to.addChildNode(this);
        this.parentNode = to;
    }

    public getFullName(): Name {
        const result: Name = this.parentNode.getFullName();
        result.append(this.getBaseName());
        return result;
    }

    public getBaseName(): string {
        return this.doGetBaseName();
    }

    protected doGetBaseName(): string {
        return this.baseName;
    }

    public rename(bn: string): void {
        this.doSetBaseName(bn);
    }

    protected doSetBaseName(bn: string): void {
        this.baseName = bn;
    }

    public getParentNode(): Directory {
        return this.parentNode;
    }

    /**
     * Returns all nodes in the tree that match bn
     * @param bn basename of node being searched for
     */
    public findNodes(bn: string): Set<Node> {
        /* Base case for Nodes in general and files that just check themselves. */
        let found: Set<Node> = new Set<Node>();
        if (this.getBaseName() === bn) {
            found.add(this);
        }
        this.assertClassInvariants();
        return found;
    }

    protected assertClassInvariants(): void {
        const bn: string = this.doGetBaseName();
        const pn: string = this.getParentNode().doGetBaseName();
        InvalidStateException.assert(this.isValidBaseName(bn), "invalid base name: " + bn + "child of " + pn);
    }

    protected isValidBaseName(bn: string): boolean {
        return bn != "";
    }
}
