import { describe, it, expect, vi } from "vitest";

import { Name } from "../../../src/adap-b06/names/Name";
import { StringName } from "../../../src/adap-b06/names/StringName";
import { StringArrayName } from "../../../src/adap-b06/names/StringArrayName";

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
    n = n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringName("oss.cs.fau");
    n = n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringName("oss.cs.fau.de");
    n = n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Basic StringArrayName function tests", () => {
  it("test insert", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n = n.insert(1, "cs");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test append", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau"]);
    n = n.append("de");
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it("test remove", () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    n = n.remove(0);
    expect(n.asString()).toBe("cs.fau.de");
  });
});

describe("Delimiter function tests", () => {
  it("test insert", () => {
    let n: Name = new StringName("oss#fau#de", '#');
    n = n.insert(1, "cs");
    expect(n.asString()).toBe("oss#cs#fau#de");
  });
});

describe("Escape character extravaganza", () => {
  it("test escape and delimiter boundary conditions", () => {
    let n: Name = new StringName("oss.cs.fau.de", '#');
    expect(n.getNoComponents()).toBe(1);
    expect(n.asString()).toBe("oss.cs.fau.de");
    n = n.append("people");
    expect(n.asString()).toBe("oss.cs.fau.de#people");
  });
});

describe('Advanced StringName insert, append, delete tests', () => {
  it("insert at the end", () => {
    let n: Name = new StringName("oss.fau.de");
    n = n.insert(2, "cs");
    expect(n.asString()).toBe("oss.fau.cs.de");
  });
  it("append", () => {
    let n: Name = new StringName("oss.fau.de");
    n = n.append("cs");
    expect(n.asString()).toBe("oss.fau.de.cs");
  });
  it("delete", () => {
    let n: Name = new StringName("oss.fau.de");
    n = n.remove(2);
    expect(n.asString()).toBe("oss.fau");
  });
  it("setComponent", () => {
    let n: Name = new StringName("oss.fau.de");
    n = n.setComponent(2, "cs");
    expect(n.asString()).toBe("oss.fau.cs");
  });
  it("setComponent", () => {
    let n: Name = new StringName("oss.fau.de");
    n = n.setComponent(0, "apf");
    expect(n.asString()).toBe("apf.fau.de");
  });
});


describe('Advanced StringArrayName insert, append, delete tests', () => {
  it("insert at the end", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n = n.insert(2, "cs");
    expect(n.asString()).toBe("oss.fau.cs.de");
  });
  it("append", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n = n.append("cs");
    expect(n.asString()).toBe("oss.fau.de.cs");
  });
  it("delete", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n = n.remove(2);
    expect(n.asString()).toBe("oss.fau");
  });
  it("setComponent", () => {
    let n: Name = new StringArrayName(["oss", "fau", "de"]);
    n = n.setComponent(2, "cs");
    expect(n.asString()).toBe("oss.fau.cs");
  });
});

describe('Length/No Components Tests StringName', () => {
  it("Empty Name Components", () => {
    let n: Name = new StringName("");
    expect(n.getNoComponents()).toBe(0);
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
    expect(n.getNoComponents()).toBe(0);
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
    let n: Name = new StringName("oss.cs");
    let m: Name = new StringName("fau.de");
    n = n.concat(m);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it('StringName concat Name with empty Name', () => {
    let n: Name = new StringName("oss.cs");
    let m: Name = new StringName("");
    n = n.concat(m);
    expect(n.asString()).toBe("oss.cs");
  });
  it('StringName concat empty Name with Name', () => {
    let n: Name = new StringName("");
    let m: Name = new StringName("oss.cs");
    n = n.concat(m);
    expect(n.asString()).toBe("oss.cs");
  });
  it('StringName concat empty Names', () => {
    let n: Name = new StringName("");
    let m: Name = new StringName("");
    n = n.concat(m);
    expect(n.asString()).toBe("");
  });
});

describe('Concat', () => {
  it('StringArrayName concat', () => {
    let n: Name = new StringArrayName(["oss", "cs"]);
    let m: Name = new StringArrayName(["fau", "de"]);
    n = n.concat(m);
    expect(n.asString()).toBe("oss.cs.fau.de");
  });
  it('StringArrayName concat empty Name', () => {
    let n: Name = new StringArrayName(["oss", "cs"]);
    let m: Name = new StringArrayName([""]);
    n = n.concat(m);
    expect(n.asString()).toBe("oss.cs");
  });
  it('StringArrayName concat empty Name', () => {
    let n: Name = new StringArrayName([""]);
    let m: Name = new StringArrayName(["oss", "cs"]);
    n = n.concat(m);
    expect(n.asString()).toBe("oss.cs");
  });
  it('StringArrayName concat empty Names', () => {
    let n: Name = new StringArrayName([""]);
    let m: Name = new StringArrayName([""]);
    n = n.concat(m);
    expect(n.asString()).toBe("");
  });
});


describe('Extensive DataString Tests', () => {
  it('StringName with new delimiter', () => {
    let n: StringName = new StringName("abc#de\\#f#g.hi", '#');
    expect(n.asDataString()).toBe("abc.de#f.g\\.hi");
  });
  it('StringArrayName with new delimiter', () => {
    let n: StringArrayName = new StringArrayName(["abc", "de\\#f", "g.hi"], '#');
    expect(n.asDataString()).toBe("abc.de#f.g\\.hi");
  })
});

describe('asStringTests', () => {
  it('StringName', () => {
    let n = new StringName("a\\\\.bc\\.de");
    expect(n.asString()).toBe("a\\.bc.de");
  });
});


describe('Immutability Tests', () => {
  it('StringName', () => {
    let n: Name = new StringName("oss.cs.fau.de");
    let copy: Name = n.clone() as Name;
    expect(n.isEqual(copy)).toBe(true);

    n.append("abc");
    expect(n.isEqual(copy)).toBe(true);

    n.concat(copy);
    expect(n.isEqual(copy)).toBe(true);

    n.insert(0, "abc");
    expect(n.isEqual(copy)).toBe(true);

    n.remove(0);
    expect(n.isEqual(copy)).toBe(true);

    n.setComponent(0, "abc");
    expect(n.isEqual(copy)).toBe(true);
  });

  it('StringArrayName', () => {
    let n: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
    let copy: Name = n.clone() as Name;
    expect(n.isEqual(copy)).toBe(true);

    n.append("abc");
    expect(n.isEqual(copy)).toBe(true);

    n.concat(copy);
    expect(n.isEqual(copy)).toBe(true);

    n.insert(0, "abc");
    expect(n.isEqual(copy)).toBe(true);

    n.remove(0);
    expect(n.isEqual(copy)).toBe(true);

    n.setComponent(0, "abc");
    expect(n.isEqual(copy)).toBe(true);
  });
});

describe('Equality Contract - This is really hard to test, so this stays empty for now.', () => {
  let san: Name = new StringArrayName(["oss", "cs", "fau", "de"]);
  let sn: Name = new StringName("oss.cs.fau.de");
  it('Reflexive', () => {
    expect(san.isEqual(new StringArrayName(["oss", "cs", "fau", "de"]))).toBe(true);
    expect(sn.isEqual(new StringName("oss.cs.fau.de"))).toBe(true);
  });
  it('Symmetric', () => {
    
  });

})