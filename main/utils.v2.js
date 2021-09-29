const iniPaths = (paths, i, j) => {
    if (paths[i] == undefined) paths[i] = {};
    return paths[i][j] = [];
}

const getPaths = (paths, i, j) => {
    if (paths[i] == undefined) paths[i] = {};
    if (paths[i][j] == undefined) paths[i][j] = [];
    return paths[i][j];
}

const addPath = (paths, i, j, path) => {
    getPaths(paths, i, j).push(path);
    return paths[i][j];
}

////////////////////////////////////////////////////////////////////////////////

const pointEq = (p1, p2) => {
    return p1[0] == p2[0] && p1[1] == p2[1];
}

const getNeighbors = (point, width, height) => {
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

////////////////////////////////////////////////////////////////////////////////

const mux = (modulo, a, b) => {
    return a*modulo + b;
}

const demux = (modulo, line) => {
    let quotient  = Math.floor(line/modulo);
    let remainder = line % modulo;
    return [quotient, remainder];
}

const minimum = (pathmap, key, dis) => {
    return Math.min(pathmap[key] ? pathmap[key] : dis, dis);
}

module.exports = {
    iniPaths, getPaths, addPath,
    pointEq, getNeighbors,
    mux, demux,
    minimum
}

console.log(module.exports);