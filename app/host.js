let host = window.location.hostname;
let port = window.location.port;
let path = "/api";

let peer;
let clients = [];

let sessionToken = localStorage.getItem("sessionToken");
if (sessionToken === null) {
    getNewToken();
}

async function getNewToken() {
    let data = await jQuery.getJSON("https://opentdb.com/api_token.php?command=request");
    console.log(data.response_message);
    sessionToken = data.token;
    localStorage.setItem("sessionToken", sessionToken);
}

async function resetToken() {
    let res = await jQuery.getJSON("https://opentdb.com/api_token.php?command=reset&token=" + sessionToken);
    console.log("All questions seen, resetting session token...");
}


async function getNextQuestion() {
    let res = await jQuery.getJSON("https://opentdb.com/api.php?amount=1&type=multiple&token=" + sessionToken);
    switch (res.response_code) {
        case 0: return res.results[0];
        case 1: console.error("Open Trivia DB: Search found no results."); return null;
        case 2: console.error("Open Trivia DB: Invalid query parameters."); return null;
        case 3: await getNewToken(); return getNextQuestion();
        case 4: await resetToken(); return getNextQuestion();
    }
    return  res.results[0];
}

function createHost() {
    let id = Math.floor((Math.random() * 10000)).toString().padStart(4, "0");
    peer = new Peer(id, {host: host, port: port, path: path});

    peer.on("error", (err) => {
        if (err.type === "unavailable-id"){
            createHost(); //Generate a new random ID and try again
        } else {
            $("#roomCode").html(err); //Display error
            throw err;
        }
    });

    peer.on("open", (id) => {
        $("#roomCode").append(id)
    });

    peer.on("connection", onConnect);
}

function onConnect(conn) {
    let client = {conn: conn};
    clients.push(client);
    updateClientList();

    conn.on("data", (data) => {
        if (data.type === "setName") {
            client.name = data.name;
            updateClientList();
        }
    });

    conn.on("close", () => {
        clients = clients.filter(c => c !== client);
        updateClientList();
    });
}

function updateClientList() {
    if (clients.length === 0) {
        $("#clientList").html("No Players");
    } else {
        $("#clientList").html($("<li>").html(clients.map(client => client.name).join("</li><li>")));
    }
}

function send(data) {
    clients.forEach((client) => { client.conn.send(data); });
}

if (util.supports.data) {
    createHost();
} else {
    console.log("Sorry, your browser version is not supported.");
}
