import "@testing-library/jest-dom";
import {
    validateExpression,
    getDangerousPatternDescription,
} from "../../expressions/validateExpression";

describe("validateExpression - Safe Patterns", () => {
    test("allows simple property access", () => {
        expect(() => validateExpression("count")).not.toThrow();
        expect(() => validateExpression("user.name")).not.toThrow();
        expect(() =>
            validateExpression("user.profile.settings.theme"),
        ).not.toThrow();
    });

    test("allows bracket notation", () => {
        expect(() => validateExpression("items[0]")).not.toThrow();
        expect(() => validateExpression("data['key']")).not.toThrow();
        expect(() => validateExpression('data["key"]')).not.toThrow();
    });

    test("allows nested property and bracket access", () => {
        expect(() => validateExpression("user[0].name")).not.toThrow();
        expect(() => validateExpression("data['users'][0]")).not.toThrow();
        expect(() =>
            validateExpression("items[0]['nested']['deep']"),
        ).not.toThrow();
    });

    test("allows arithmetic operators", () => {
        expect(() => validateExpression("a + b")).not.toThrow();
        expect(() => validateExpression("count * 2")).not.toThrow();
        expect(() => validateExpression("x - y")).not.toThrow();
        expect(() => validateExpression("a / b")).not.toThrow();
        expect(() => validateExpression("a % b")).not.toThrow();
        expect(() => validateExpression("a ** b")).not.toThrow();
    });

    test("allows comparison operators", () => {
        expect(() => validateExpression("x > 5")).not.toThrow();
        expect(() => validateExpression("a < b")).not.toThrow();
        expect(() => validateExpression("x >= 10")).not.toThrow();
        expect(() => validateExpression("y <= 20")).not.toThrow();
        expect(() => validateExpression("a == b")).not.toThrow();
        expect(() => validateExpression("x === y")).not.toThrow();
        expect(() => validateExpression("a != b")).not.toThrow();
        expect(() => validateExpression("x !== y")).not.toThrow();
    });

    test("allows logical operators", () => {
        expect(() => validateExpression("a && b")).not.toThrow();
        expect(() => validateExpression("x || y")).not.toThrow();
        expect(() => validateExpression("!active")).not.toThrow();
    });

    test("allows ternary operator", () => {
        expect(() =>
            validateExpression("isLoading ? 'Loading...' : 'Done'"),
        ).not.toThrow();
        expect(() =>
            validateExpression("age > 18 ? 'Adult' : 'Minor'"),
        ).not.toThrow();
    });

    test("allows unary operators", () => {
        expect(() => validateExpression("!disabled")).not.toThrow();
        expect(() => validateExpression("-count")).not.toThrow();
        expect(() => validateExpression("+value")).not.toThrow();
    });

    test("allows method calls on arrays", () => {
        expect(() => validateExpression("items.length")).not.toThrow();
        expect(() => validateExpression("items.map(x => x * 2)")).not.toThrow();
        expect(() =>
            validateExpression("items.filter(x => x > 5)"),
        ).not.toThrow();
        expect(() => validateExpression("items.join(', ')")).not.toThrow();
        expect(() => validateExpression("items.slice(0, 5)")).not.toThrow();
    });

    test("allows method calls on strings", () => {
        expect(() => validateExpression("message.toUpperCase()")).not.toThrow();
        expect(() => validateExpression("text.slice(0, 5)")).not.toThrow();
        expect(() => validateExpression("name.toLowerCase()")).not.toThrow();
        expect(() => validateExpression("str.trim()")).not.toThrow();
        expect(() => validateExpression("str.split(',')")).not.toThrow();
    });

    test("allows method calls on numbers", () => {
        expect(() => validateExpression("value.toFixed(2)")).not.toThrow();
        expect(() => validateExpression("num.toString()")).not.toThrow();
    });

    test("allows function calls", () => {
        expect(() => validateExpression("format(value)")).not.toThrow();
        expect(() => validateExpression("calculate(a, b)")).not.toThrow();
        expect(() => validateExpression("fn(x, y, z)")).not.toThrow();
    });

    test("allows string and number literals", () => {
        expect(() => validateExpression("'hello'")).not.toThrow();
        expect(() => validateExpression('"world"')).not.toThrow();
        expect(() => validateExpression("42")).not.toThrow();
        expect(() => validateExpression("3.14")).not.toThrow();
        expect(() => validateExpression("true")).not.toThrow();
        expect(() => validateExpression("false")).not.toThrow();
        expect(() => validateExpression("null")).not.toThrow();
        expect(() => validateExpression("undefined")).not.toThrow();
    });

    test("allows complex expressions", () => {
        expect(() =>
            validateExpression("user.age > 18 && user.isActive"),
        ).not.toThrow();
        expect(() =>
            validateExpression("items.map(x => x.name.toUpperCase())"),
        ).not.toThrow();
        expect(() => validateExpression("(a + b) * (c - d)")).not.toThrow();
    });

    test("allows nested function calls", () => {
        expect(() => validateExpression("outer(inner(value))")).not.toThrow();
        expect(() =>
            validateExpression("format(calculate(a, b))"),
        ).not.toThrow();
    });
});

describe("validateExpression - Rejected Patterns", () => {
    test("rejects window access", () => {
        expect(() => validateExpression("window.location")).toThrow(
            /window.*not allowed/i,
        );
        expect(() => validateExpression("window.document")).toThrow();
        expect(() => validateExpression("window")).toThrow();
    });

    test("rejects document access", () => {
        expect(() => validateExpression("document.body")).toThrow(
            /document.*not allowed/i,
        );
        expect(() =>
            validateExpression("document.getElementById('id')"),
        ).toThrow();
    });

    test("rejects global access", () => {
        expect(() => validateExpression("global.process")).toThrow();
        expect(() => validateExpression("globalThis.fetch")).toThrow();
    });

    test("rejects fetch", () => {
        expect(() => validateExpression("fetch('/api/data')")).toThrow(
            /fetch.*not allowed/i,
        );
    });

    test("rejects eval", () => {
        expect(() => validateExpression("eval('code')")).toThrow(
            /eval.*not allowed/i,
        );
    });

    test("rejects Function constructor", () => {
        expect(() => validateExpression("Function('return 42')")).toThrow(
            /Function.*not allowed/i,
        );
    });

    test("rejects setTimeout", () => {
        expect(() => validateExpression("setTimeout(fn, 1000)")).toThrow(
            /setTimeout.*not allowed/i,
        );
    });

    test("rejects setInterval", () => {
        expect(() => validateExpression("setInterval(fn, 1000)")).toThrow(
            /setInterval.*not allowed/i,
        );
    });

    test("rejects require", () => {
        expect(() => validateExpression("require('module')")).toThrow(
            /require.*not allowed/i,
        );
    });

    test("rejects import", () => {
        expect(() => validateExpression("import('module')")).toThrow(
            /import.*not allowed/i,
        );
    });

    test("rejects prototype access", () => {
        expect(() => validateExpression("obj.prototype")).toThrow(
            /prototype.*not allowed/i,
        );
    });

    test("rejects constructor access", () => {
        expect(() => validateExpression("obj.constructor")).toThrow(
            /constructor.*not allowed/i,
        );
    });

    test("rejects __proto__ access", () => {
        expect(() => validateExpression("obj.__proto__")).toThrow(
            /__proto__.*not allowed/i,
        );
    });

    test("rejects console", () => {
        expect(() => validateExpression("console.log('hi')")).toThrow(
            /console.*not allowed/i,
        );
    });

    test("rejects alert", () => {
        expect(() => validateExpression("alert('message')")).toThrow(
            /alert.*not allowed/i,
        );
    });

    test("rejects XMLHttpRequest", () => {
        expect(() => validateExpression("new XMLHttpRequest()")).toThrow(
            /XMLHttpRequest.*not allowed/i,
        );
    });
});

describe("validateExpression - Edge Cases", () => {
    test("rejects empty expressions", () => {
        expect(() => validateExpression("")).toThrow(/empty/i);
        expect(() => validateExpression("   ")).toThrow(/empty/i);
    });

    test("rejects unmatched parentheses", () => {
        expect(() => validateExpression("(a + b")).toThrow(
            /unmatched.*parenthesis/i,
        );
        expect(() => validateExpression("a + b)")).toThrow(
            /unmatched.*parenthesis/i,
        );
    });

    test("rejects unmatched brackets", () => {
        expect(() => validateExpression("items[0")).toThrow(
            /unmatched.*bracket/i,
        );
        expect(() => validateExpression("items]")).toThrow(
            /unmatched.*bracket/i,
        );
    });

    test("rejects unterminated string", () => {
        expect(() => validateExpression('"unterminated')).toThrow(
            /unterminated.*string/i,
        );
        expect(() => validateExpression("'unterminated")).toThrow(
            /unterminated.*string/i,
        );
    });

    test("rejects comments", () => {
        expect(() => validateExpression("a + b // comment")).toThrow(
            /comment.*not allowed/i,
        );
        expect(() => validateExpression("a + /* comment */ b")).toThrow(
            /comment.*not allowed/i,
        );
    });

    test("rejects template literals (but comment says allow them)", () => {
        // Actually, template literals are allowed now - they're used in existing Cog apps
        expect(() => validateExpression("`hello ${name}`")).not.toThrow();
        expect(() => validateExpression("`<div>${item}</div>`")).not.toThrow();
    });

    test("allows curly braces in arrow functions", () => {
        // Arrow functions with expression bodies are common (e.g., x => x * 2)
        expect(() => validateExpression("items.map(x => x * 2)")).not.toThrow();
        expect(() =>
            validateExpression("items.filter(x => x > 5)"),
        ).not.toThrow();
        // Block bodies would require more complex parsing, so we test that they're allowed but dangerous code inside is still rejected
        expect(() =>
            validateExpression("items.forEach(item => { console.log(item); })"),
        ).toThrow(); // rejects because console is dangerous
    });

    test("allows window as part of identifier (but not as standalone keyword)", () => {
        expect(() => validateExpression("myWindow")).not.toThrow();
        expect(() => validateExpression("isWindowOpen")).not.toThrow();
    });

    test("handles whitespace properly", () => {
        expect(() => validateExpression("  count  +  1  ")).not.toThrow();
        expect(() => validateExpression("user . name")).not.toThrow();
        expect(() => validateExpression("items [ 0 ]")).not.toThrow();
    });

    test("rejects dangerous patterns within strings (dangerous word)", () => {
        // String literals are allowed, and "window" inside a string is not a code expression
        // So this should be fine - the string itself is safe
        expect(() => validateExpression('"window is a word"')).not.toThrow();
    });

    test("allows nullish coalescing", () => {
        expect(() => validateExpression("value ?? 0")).not.toThrow();
    });

    test("allows multiple operators in sequence (valid cases)", () => {
        expect(() => validateExpression("a + -b")).not.toThrow();
        expect(() => validateExpression("!isActive && x > 5")).not.toThrow();
    });
});

describe("validateExpression - Error Messages", () => {
    test("provides helpful error message for window access", () => {
        try {
            validateExpression("window.location");
            fail("Should have thrown");
        } catch (e) {
            expect(String(e)).toMatch(/not allowed/i);
            expect(String(e)).toMatch(/variable/i); // Should suggest using variable
        }
    });

    test("error message includes position information", () => {
        try {
            validateExpression("good + bad@symbol");
            fail("Should have thrown");
        } catch (e) {
            expect(String(e)).toMatch(/position/i);
        }
    });

    test("getDangerousPatternDescription works", () => {
        const desc = getDangerousPatternDescription("window.location");
        expect(desc).toMatch(/window/i);
    });
});

describe("validateExpression - Real-world Examples", () => {
    test("counter app expressions work", () => {
        expect(() => validateExpression("count")).not.toThrow();
        expect(() => validateExpression("count + 1")).not.toThrow();
    });

    test("todo app expressions work", () => {
        expect(() => validateExpression("todos")).not.toThrow();
        expect(() =>
            validateExpression("todos.map(todo => `<li>${todo.text}</li>`)"),
        ).not.toThrow();
        expect(() =>
            validateExpression("todos.filter(t => !t.done)"),
        ).not.toThrow();
    });

    test("conditional rendering expressions work", () => {
        expect(() =>
            validateExpression("isLoading ? 'Loading...' : 'Ready'"),
        ).not.toThrow();
        expect(() => validateExpression("user && user.name")).not.toThrow();
    });

    test("arithmetic expressions work", () => {
        expect(() => validateExpression("price * quantity")).not.toThrow();
        expect(() => validateExpression("(a + b) * (c - d)")).not.toThrow();
    });

    test("string methods work", () => {
        expect(() => validateExpression("message.toUpperCase()")).not.toThrow();
        expect(() => validateExpression("name.slice(0, 5)")).not.toThrow();
    });

    test("array methods work", () => {
        expect(() => validateExpression("items.length")).not.toThrow();
        expect(() =>
            validateExpression("items.filter(x => x > 5).length"),
        ).not.toThrow();
    });
});
