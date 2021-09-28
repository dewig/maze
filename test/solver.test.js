const solver = require("../main/maze-solver");
const getCasesPromise = require("./test.data.js")

const casesPromise = getCasesPromise("./test/solver-cases/");

const description01 = "technical test";
test(description01, async () => {
    const casesResolved = await casesPromise;
    const localCase = casesResolved[description01];
    expect(solver(localCase)).toStrictEqual(localCase.expected);
});

const description02 = "exit next to the start";
test(description02, async () => {
    const casesResolved = await casesPromise;
    const localCase = casesResolved[description02];
    expect(solver(localCase)).toStrictEqual(localCase.expected);
});

const description03 = "no exit";
test(description03, async () => {
    const casesResolved = await casesPromise;
    const localCase = casesResolved[description03];
    expect(solver(localCase)).toStrictEqual(localCase.expected);
});
