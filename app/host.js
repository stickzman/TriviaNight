let peer, id;
let clients = [];

function init() {
    id = Math.floor((Math.random() * 10000)).toString().padStart(4, "0");
    peer = new Peer(id, {host: 'localhost', port: 3000, path: '/api'});

    peer.on("error", (err) => {
        if (err.type === "unavailable-id"){
            init();
        } else {
            throw err;
        }
    });

    peer.on("open", (id) => {
        $("#roomCode").append(id)
    });

    peer.on("connection", (conn) => {
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
    init();
} else {
    console.log("Sorry, your browser version is not supported.");
}
