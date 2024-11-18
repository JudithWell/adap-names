import { describe, it, expect } from "vitest";
import { Name } from "../../../src/adap-b01/names/Name";

describe("Basic initialization tests", () => {
  it("test construction 1", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Basic function tests", () => {
  it("test insert", () => {
    let n: Name = new Name(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new Name(["oss", "fau", "de"], '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    // Original name string = "oss.cs.fau.de"
    let n: Name = new Name(["oss.cs.fau.de"], '#');
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

/** extra tests: */
describe("Basic function tests", () => {
  it("Insertion at end", () => {
    let n: Name = new Name(["oss", "cs", "fau"]);
    n.insert(3, "de");
    expect(n.asNameString()).toBe("oss.cs.fau.de");
  });
});

describe("Getter tests", () => {
  it("getComponent() test", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.getComponent(1)).toBe("cs");
  });

  it("getNoComponents() test", () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    expect(n.getNoComponents()).toBe(4);
  });
});

describe('Remove test', () => {
  it('Test with getNoComponents', () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    n.remove(1);
    expect(n.getNoComponents()).toBe(3);
  })

  it('Test with equality', () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    n.remove(1);
    expect(n.asNameString()).toBe("oss.fau.de");
  })

  it('Test with out of bounds', () => {
    let n: Name = new Name(["oss", "cs", "fau", "de"]);
    n.remove(4);
    expect(n.asNameString()).toBe("oss.cs.fau.de");
  })
})