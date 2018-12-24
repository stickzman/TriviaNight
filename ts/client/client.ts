/// <reference path="../common.ts" />
let host: string = window.location.hostname;
let port: string = window.location.port;
let path: string = "/api";

let peer, conn;

function connect() {
    if ($("#roomCode").val().length == 0) {
        console.log("Please enter a Room Code");
        return;
    }

    conn = peer.connect($("#roomCode").val());
    $("#networkDiv input").attr("disabled", "disabled");

    conn.on("open", () => {
        $("#networkDiv").hide();
        conn.send({
            type: "setName",
            name: $("#nickname").val()
        });
    });

    conn.on("data", (data) => {
        console.log(data);
    });
}


function init() {
    peer = new Peer({host: host, port: port, path: path});

    peer.on("error", (err) => {
        if (err.type === "invalid-id" || err.type === "peer-unavailable") {
            console.log("Invalid Room Code")
            $("#networkDiv input").removeAttr("disabled");
        } else {
            throw err;
        }
    });

    peer.on("open", (id) => {
        console.log('My peer ID is: ' + id);
    });

    $("#connBtn").on("click", connect);
    $("#networkDiv").on("keypress", (e) => {
        (e.key === "Enter") ? $("#connBtn").click() : null;
    });
}

if (util.supports.data) {
    init();
} else {
    console.log("Sorry, your browser version is not supported.");
}
