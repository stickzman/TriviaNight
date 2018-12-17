let peer, id;
let clients = [];

function init() {
    id = Math.floor((Math.random() * 10000)).toString().padStart(4, "0");
    peer = new Peer(id, {key: 'lwjd5qra8257b9'});

    peer.on("error", (err) => {
        if (err.type === "unavailable-id"){
            init();
        } else {
            throw err;
        }
    });

    peer.on("open", function(id) {
        $("#roomCode").append(id)
    });

    peer.on("connection", function(conn) {
        clients.push(conn);
        console.log("Connected to", conn.peer);
    });
}

function send(data) {
    clients.forEach((conn) => { conn.send(data); });
}

if (util.supports.data) {
    init();
} else {
    console.log("Sorry, your browser version is not supported.");
}
