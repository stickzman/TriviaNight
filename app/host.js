let host = "localhost";
let port = 3000;
let path = "/api";

let peer;
let clients = [];

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
