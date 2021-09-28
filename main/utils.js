const validate = (data) => {

    if (!(data.maze instanceof Array)) return false;

    if (data.maze.length < 1) return false;

    const predicate = elem => (elem instanceof Array)
                   && elem.length > 1 && elem.length == data.maze[0].length;

    if (!data.maze.every(predicate)) return false;

    return true;
}

module.exports = {
    validate
}