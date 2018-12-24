/// <reference path="../common.ts" />
/// <reference path="state.ts" />
let host: string = window.location.hostname;
let port: string = window.location.port;
let path: string = "/api";

let peer, state: State = new InitState().enter();

let clients: client[] = [];

let sessionToken: string = localStorage.getItem("sessionToken");
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
    await jQuery.getJSON("https://opentdb.com/api_token.php?command=reset&token=" + sessionToken);
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
    return res.results[0];
}

function init() {
    let id = Math.floor((Math.random() * 10000)).toString().padStart(4, "0");
    peer = new Peer(id, {host: host, port: port, path: path});

    peer.on("open", (id) => {
        $("#roomCode").append(id)
    });

    peer.on("connection", onConnect);

    peer.on("error", (err) => {
        if (err.type === "unavailable-id"){
            init(); //Generate a new random ID and try again
        } else {
            $("#roomCode").html(err); //Display error
            throw err;
        }
    });
}

function onConnect(conn) {
    let client = {name: "", score: 0, conn: conn};
    clients.push(client);

    conn.on("data", (data) => {
        if (data.type === "setName") {
            client.name = data.name;
            addPlayer(client);
        }
    });

    conn.on("data", (data) => { state.processData(data, client); });

    conn.on("close", () => {
        clients = clients.filter(c => c !== client);
        removePlayer(client);
    });
}

function addPlayer(p: client) {
    $(`<div id="pID_${p.conn.id}"><p>${p.name}</p><p>${p.score}</p></div>`).css("padding", "0px 10px").appendTo("#pList");
}

function removePlayer(p: client) {
    $("#pID_" + p.conn.id).remove();
}

function send(data) {
    clients.forEach((client) => { client.conn.send(data); });
}

if (util.supports.data) {
    init();
} else {
    console.log("Sorry, your browser version is not supported.");
}
