/// <reference path="../common.ts" />
/// <reference path="helper.ts" />
/// <reference path="connection.ts" />
let host: string = window.location.hostname;
let port: string = window.location.port;
let path: string = "/api";

let peer, conn, currScreen = $("#connectScreen");
let hue: number;

function init() {
    peer = new Peer({host: host, port: port, path: path});

    peer.on("error", (err) => {
        if (err.type === "invalid-id" || err.type === "peer-unavailable") {
            console.log("Invalid Room Code")
            $("#connectScreen input").removeAttr("disabled");
        } else {
            throw err;
        }
    });

    peer.on("open", (id: string) => {
        console.log('My peer ID is: ' + id);
    });

    $("#connBtn").on("click", connect);
    $("#connectScreen").on("keypress", (e) => {
        (e.key === "Enter") ? $("#connBtn").click() : null;
    });
}

if (util.supports.data) {
    init();
} else {
    console.log("Sorry, your browser version is not supported.");
}
