/// <reference path="../common.ts" />
/// <reference path="client.ts" />
/// <reference path="state.ts" />
let host: string = window.location.hostname;
let port: string = window.location.port;
let path: string = "/api";

const MAX_SCORE = 100;
let clients: Client[] = [];
let peer: any, state: State = new InitState().enter();

//API Set up --------------------------
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
//--------------------------------------

function onConnect(conn: any) {
    let client: Client = new Client(conn);
    clients.push(client);

    conn.on("data", (data: DataPackage) => { state.processData(data, client); });

    conn.on("close", () => {
        clients = clients.filter(c => c !== client);
    });
}

function init() {
    let id = Math.floor((Math.random() * 10000)).toString().padStart(4, "0");
    peer = new Peer(id, {host: host, port: port, path: path});

    peer.on("open", (id: string) => {
        $("#roomCode").append(id)
    });

    peer.on("connection", onConnect);

    peer.on("error", (err: any) => {
        if (err.type === "unavailable-id"){
            init(); //Generate a new random ID and try again
        } else {
            //Display error
            $("#roomCode").css("font-size", "35pt").css("color", "red").html(err);
            throw err;
        }
    });
}

//Send data to all clients
function send(data: DataPackage) {
    clients.forEach((client) => { client.conn.send(data); });
}

if (util.supports.data) {
    init();
} else {
    console.log("Sorry, your browser version is not supported.");
}
