const u = require("./utils.v2");

const specialChar = 'B';

const initialize = (maze, start, pattern) => {

    const height = maze.length;
    const width = maze[0].length;
    const size = height*width;

    const patternSize = pattern.length;
    const patternArr  = pattern.split("");
        
    const paths = {};
    const exits = new Set();

    for (let mp1 = 0; mp1 < size; mp1++) {

        let p = u.demux(width, mp1);
        let currentChar = maze[p[0]][p[1]];

        // do not walk from the end
        if (!u.pointEq(p, start) && currentChar == specialChar) continue;

        for (let n of u.getNeighbors(p, width, height)) {
            
            let mp2 = u.mux(width, n[0], n[1]);
            let neighborChar = maze[n[0]][n[1]];

            // do not walk to the beginning
            if (u.pointEq(n, start)) continue;

            const collector = [];

            if (u.pointEq(p, start) && (neighborChar == pattern[0])) {
                collector.push([-1, 0, 1]);
            } else if (neighborChar == specialChar) {
                exits.add(mp2);
                patternArr.forEach((v,i) => {
                    if (v == currentChar) collector.push([i, -1, 1])
                });
            } else {
                patternArr.forEach((v,i,a) => {
                    const j = (i+1) % patternSize;
                    if (v == currentChar && a[j] == neighborChar) collector.push([i, j, 1]);
                });
            }

            collector.forEach(v => u.addPath(paths, mp1, mp2, v));
        }
    }

    return {paths: paths, exits: exits};
}

const growTransitivity = (paths, size, patternSize) => {
    for (let j = 0; j < size; j++) {
        for (let i = 0; i < size; i++) {
            for (let k = 0; k < size; k++) {
                if (i == j || j == k || k == i) continue;

                const pathsIJ = u.getPaths(paths, i, j);
                const pathsJK = u.getPaths(paths, j, k);
                const pathsIK = u.getPaths(paths, i, k);

                const pathmap = {}

                for (let pIJ of pathsIJ) {
                    for (let pJK of pathsJK) {
                        if (pIJ[1] != pJK[0]) continue;
                        let key = u.mux(patternSize + 1, pIJ[0] + 1, pJK[1] + 1);
                        pathmap[key] = u.minimum(pathmap, key, pIJ[2] + pJK[2]);
                    }
                }

                for (let pIK of pathsIK) {
                    let key = u.mux(patternSize + 1, pIK[0] + 1, pIK[1] + 1);
                    pathmap[key] = u.minimum(pathmap, key, pIK[2]);
                }

                u.iniPaths(paths, i, k);

                for (key in pathmap) {
                    let line = u.demux(patternSize + 1, key);
                    u.addPath(paths, i, k, [line[0] - 1, line[1] - 1, pathmap[key]]);
                }
            }
        }
    }
}

const assemblePath = (paths, start, exits, width, height, patternLen) => {

    const muxStart = u.mux(width, start[0], start[1]);

    const exitReducer = (a, b) => {
        const da = paths[muxStart][a];
        const db = paths[muxStart][b];

        if (da == undefined) return b;
        if (db == undefined) return a;

        return da[0][2] <= db[0][2] ? a : b;
    }

    const exitSelected = exits.reduce(exitReducer, exits[0]);

    if (exitSelected == undefined) return [];

    const exitPath = [start];
    const distance = paths[muxStart][exitSelected][0][2]

    let current = start;

    for (let step = 0; step < distance; step++) {
        current = u.getNeighbors(current, width, height).reduce((a,b) => {
            const muxA = u.mux(width, a[0], a[1]);
            const muxB = u.mux(width, b[0], b[1]);

            if (muxA == exitSelected) return a;
            if (muxB == exitSelected) return b;

            const stepMod = step % patternLen;

            let da = paths[muxA][exitSelected];
            let db = paths[muxB][exitSelected];

            if (da == undefined) return b;
            if (db == undefined) return a;

            da = da.filter(v => v[0] == stepMod);
            da = da.filter(v => v[0] == stepMod);

            if (da.length < 1) return b;
            if (db.length < 1) return a;

            return da[0][2] <= db[0][2] ? a : b;
        });

        exitPath.push(current);
    }

    return exitPath;
}

// based on Floyd–Warshall algorithm
const solver = data => {

    const {maze, start, pattern} = data;

    const height = maze.length;
    const width = maze[0].length;

    u.getNeighbors(start, width, height).forEach(v => {
        if (maze[v[0],v[1]] == specialChar) return [start, v];
    });
        
    const {paths, exits} = initialize(maze, start, pattern);

    if (exits.size < 1) return [];

    const patternLen = pattern.length;

    growTransitivity(paths, height*width, patternLen);

    return assemblePath(paths, start, Array.from(exits), width, height, patternLen);
}

module.exports = solver;