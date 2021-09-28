const fs = require('fs').promises;

const getCasesPromise = async baseDir => {
    const files = await fs.readdir(baseDir);

    const contentsPromise = [];
    files.forEach(file => contentsPromise.push(fs.readFile(baseDir + file, "utf8")));
    const contents = await Promise.all(contentsPromise);

    const cases = {};
    contents
        .map(content => JSON.parse(content))
        .forEach(content => cases[content.description] = content);

    return cases;
}

module.exports = getCasesPromise;