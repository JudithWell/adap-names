import { Node } from "./Node";
import { Directory } from "./Directory";

export class Link extends Node {

    protected targetNode: Node | null = null;

    constructor(bn: string, pn: Directory, tn?: Node) {
        super(bn, pn);

        if (tn != undefined) {
            this.targetNode = tn;
        }
    }

    public getTargetNode(): Node | null {
        return this.targetNode;
    }

    public setTargetNode(target: Node): void {
        this.targetNode = target;
    }

    public getBaseName(): string {
        const target = this.ensureTargetNode(this.targetNode);
        return target.getBaseName();
    }

    public rename(bn: string): void {
        const target = this.ensureTargetNode(this.targetNode);
        target.rename(bn);
    }

    protected ensureTargetNode(target: Node | null): Node {
        const result: Node = this.targetNode as Node;
        return result;
    }

    public findNodes(bn: string): Set<Node> {
        /* Check the links baseName */
        let found = super.findNodes(bn);
        /* Recurse to targetNode */
        const target = this.ensureTargetNode(this.targetNode);
        target.findNodes(bn).forEach((node) => {
            found.add(node);
        });

        this.assertClassInvariants();
        return found;
    }
}