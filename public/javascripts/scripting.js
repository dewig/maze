const sampleData = {
    maze : [
        ["A","B","A","A","A","A","A","A","A","A","A","A"],
        ["A","C","A","D","D","E","A","C","C","C","D","A"],
        ["A","C","C","D","A","E","A","D","A","D","A","A"],
        ["A","A","A","A","A","E","D","D","A","D","E","A"],
        ["A","C","C","D","D","D","A","A","A","A","E","A"],
        ["A","C","A","A","A","A","A","D","D","D","E","A"],
        ["A","D","D","D","E","E","A","C","A","A","A","A"],
        ["A","A","A","E","A","E","A","C","C","D","D","A"],
        ["A","D","E","E","A","D","A","A","A","A","A","A"],
        ["A","A","D","A","A","D","A","C","D","D","A","A"],
        ["A","D","D","D","A","D","C","C","A","D","E","B"],
        ["A","A","A","A","A","A","A","A","A","A","A","A"]
    ],

    start : [0,1],

    pattern : "CCC-DDD-EEE-DDD",
}

const getInputs = () => {
    const maze = document.querySelector("[name='maze']")
    const start = document.querySelector("[name='start']")
    const pattern = document.querySelector("[name='pattern']")

    return {maze: maze, start: start, pattern: pattern}
}

const fillWithDefaultData = () => {
    const {maze, start, pattern} = getInputs();
    maze.value = sampleData.maze.map(row => row.join()).join("\n");
    start.value = sampleData.start.join();
    pattern.value = sampleData.pattern;
}

const clearData = () => {
    const {maze, start, pattern} = getInputs();
    maze.value = "";
    start.value = "";
    pattern.value = "";
}

const submit = () => {
    const {maze, start, pattern} = getInputs();
    
    try {
        const data = {
            maze: maze.value.toUpperCase().split("\n").map(row => row.split(",")),
            start: start.value.replaceAll(/[^0-9,]/g,"").split(",").map(str => JSON.parse(str)),
            pattern: pattern.value.toUpperCase().replaceAll(/[^A-Z]/g,"")
        }
    
        const xhr = new XMLHttpRequest()
        xhr.open("POST", "/solve")
        xhr.setRequestHeader("Content-Type", "application/json");
    
        xhr.onreadystatechange = () => {
            if (xhr.readyState == XMLHttpRequest.DONE) {
    
                const response = JSON.parse(xhr.response);
    
                if (xhr.status == 200) {
                    alert("path: " + JSON.stringify(response.path));
                } else {
                    const message = "error: " + xhr.status + ", " + response.error;
                    console.log(message);
                    alert(message);
                }
            }
        };
    
        xhr.send(JSON.stringify(data));
    } catch (e) {
        alert("invalid data");
    }
}