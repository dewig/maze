const getNeighbors = (point, height, width) => {
    const left  = [point[0], point[1] - 1];
    const right = [point[0], point[1] + 1];
    const down  = [point[0] + 1, point[1]];
    const up    = [point[0] - 1, point[1]];

    const neighbors = [];

    if (up[0] >= 0)       neighbors.push(up);
    if (right[1] < width) neighbors.push(right);
    if (down[0] < height) neighbors.push(down);
    if (left[1] >= 0)     neighbors.push(left);  

    return neighbors;
}

const makeKey = (point) => {
    return point[0] + "-" + point[1];
}

const checkPattern = (pattern, pos, map, e) => {
    return map[e[0]][e[1]] == pattern[pos % pattern.length];
}

/*
GENERAL IDEA OF THE ALGORITHM

Get the neighbors (up, right, down, left) from the current position, ignoring the ones alredy in
the current path (a path cannot self-cut).

Check if one of the neighbors is a 'B', if so you are free.

Only retain the neighbors satisfying the pattern.

If you took a step back in the previous cycle, only retain the neighbors after the step back position
(to explore a new path).

If you are left without neighbors, remember the current position, take a step back and loop.
If you cannot take a step back, no path is posible, you are trapped.

If you still have neighbors, choose the first as your current position and loop.
*/

// preconditions:
// 1. the maze is rectangular
// 2. the start position is on 'B'
// 3. you can only take orthogonal steps on the maze
// 4. the pattern has at least one character

const solver = data => {

    const {maze, start, pattern} = data;

    const height = maze.length;
    const width = maze[0].length;

    let path = [start];
    let taken = {};
    taken[makeKey(start)] = true;
    let retracted = undefined;

    while (path.length > 0) {

        let neighbors = getNeighbors(path[path.length - 1], height, width)
            .filter(candidate => !taken[makeKey(candidate)]);

        let finishCandidates = neighbors.filter(e => maze[e[0]][e[1]] == 'B');

        if (finishCandidates.length > 0) {
            path.push(finishCandidates[0]);
            return path;
        }

        neighbors = neighbors.filter(e => checkPattern(pattern, path.length-1, maze, e));

        if (retracted) {
            let retractedIndex = neighbors.findIndex(e => e[0] == retracted[0] && e[1] == retracted[1]);
            neighbors = retractedIndex + 1 < neighbors.length ? [neighbors[retractedIndex + 1]] : [];
        }

        if (neighbors.length < 1) {
            retracted = path.pop();
            delete taken[makeKey(retracted)];
        } else {
            retracted = undefined;
            let candidate = neighbors[0];
            taken[makeKey(candidate)] = true;
            path.push(candidate);
        }
    }

    return [];
}

module.exports = solver;