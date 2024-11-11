import { describe, it, expect, vi } from "vitest";

import { Name } from "../../../src/adap-b02/names/Name";
import { StringName } from "../../../src/adap-b02/names/StringName";
import { StringArrayName } from "../../../src/adap-b02/names/StringArrayName";

describe('Basic initialization tests for StringArrayName', () => {
  it('test constructor + getNoComponents()', () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    expect(n.getNoComponents()).toBe(3);
  });
  it('test constructor + asDataString()', () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    expect(n.asDataString()).toBe("oss.fau.de");
  });
});



describe("Basic StringName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

describe('Advanced StringName insert, append, delete tests', () => {
  it("insert at the end", () => {
    let n: Name = new StringName("oss.fau.de");
    n.insert(2, "cs");
    expect(n.asString()).toBe("oss.fau.cs.de");
  });
  it("append", () => {
    let n: Name = new StringName("oss.fau.de");
    n.append("cs");
    expect(n.asString()).toBe("oss.fau.de.cs");
  });
  it("delete", () => {
    let n: Name = new StringName("oss.fau.de");
    n.remove(2);
    expect(n.asString()).toBe("oss.fau");
  });
  it("setComponent", () => {
    let n: Name = new StringName("oss.fau.de");
    n.setComponent(2, "cs");
    expect(n.asString()).toBe("oss.fau.cs");
  });
});


describe('Advanced StringArrayName insert, append, delete tests', () => {
  it("insert at the end", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.insert(2, "cs");
    expect(n.asString()).toBe("oss.fau.cs.de");
  });
  it("append", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.append("cs");
    expect(n.asString()).toBe("oss.fau.de.cs");
  });
  it("delete", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.remove(2);
    expect(n.asString()).toBe("oss.fau");
  });
  it("setComponent", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n.setComponent(2, "cs");
    expect(n.asString()).toBe("oss.fau.cs");
  });
});

describe('Length/No Components Tests StringName', () => {
  it("Empty Name Components", () => {
    let n: Name = new StringName("");
    expect(n.getNoComponents()).toBe(1);
  });
  it("Empty Name isEmpty()", () => {
    let n: Name = new StringName("");
    expect(n.isEmpty()).toBe(true);
  });
  it("Empty Components", () => {
    let n: Name = new StringName("..");
    expect(n.getNoComponents()).toBe(3);
  });
  it("No Components", () => {
    let n: Name = new StringName("oss.fau.de");
    expect(n.getNoComponents()).toBe(3);
  });
  it("isEmpty()", () => {
    let n: Name = new StringName("oss.fau.de");
    expect(n.isEmpty()).toBe(false);
  });
});

describe('Length/No Components Tests StringArrayName', () => {
  it("Empty Name Components", () => {
    let n: Name = new StringArrayName([""]);
    expect(n.getNoComponents()).toBe(1);
  });
  it("Empty Name isEmpty()", () => {
    let n: Name = new StringArrayName([""]);
    expect(n.isEmpty()).toBe(true);
  });
  it("Empty Components", () => {
    let n: Name = new StringArrayName(["", ""]);
    expect(n.getNoComponents()).toBe(2);
  });
  it("No Components", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    expect(n.getNoComponents()).toBe(3);
  });
  it("isEmpty()", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    expect(n.isEmpty()).toBe(false);
  });
});


describe('Concat', () => {
  it('StringName concat', () => {
    let n: StringName = new StringName("oss.cs");
    let m: StringName = new StringName("fau.de");
    n.concat(m);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it('StringName concat empty Name', () => {
    let n: StringName = new StringName("oss.cs");
    let m: StringName = new StringName("");
    n.concat(m);
    expect(n.asString()).toBe("oss.cs");
  });
  it('StringName concat empty Name', () => {
    let n: StringName = new StringName("");
    let m: StringName = new StringName("oss.cs");
    n.concat(m);
    expect(n.asString()).toBe("oss.cs");
  });
  it('StringName concat empty Names', () => {
    let n: StringName = new StringName("");
    let m: StringName = new StringName("");
    n.concat(m);
    expect(n.asString()).toBe("");
  });
});

describe('Concat', () => {
  it('StringName concat', () => {
    let n: StringArrayName = new StringArrayName(["oss", "cs"]);
    let m: StringArrayName = new StringArrayName(["fau", "de"]);
    n.concat(m);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it('StringName concat empty Name', () => {
    let n: StringArrayName = new StringArrayName(["oss", "cs"]);
    let m: StringArrayName = new StringArrayName([""]);
    n.concat(m);
    expect(n.asString()).toBe("oss.cs");
  });
  it('StringName concat empty Name', () => {
    let n: StringArrayName = new StringArrayName([""]);
    let m: StringArrayName = new StringArrayName(["oss", "cs"]);
    n.concat(m);
    expect(n.asString()).toBe("oss.cs");
  });
  it('StringName concat empty Names', () => {
    let n: StringArrayName = new StringArrayName([""]);
    let m: StringArrayName = new StringArrayName([""]);
    n.concat(m);
    expect(n.asString()).toBe("");
  });
});