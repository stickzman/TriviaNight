/// <reference path="../common.ts" />
var host = window.location.hostname;
var port = window.location.port;
var path = "/api";
var peer, conn;
function connect() {
    if ($("#roomCode").val().length == 0) {
        console.log("Please enter a Room Code");
        return;
    }
    conn = peer.connect($("#roomCode").val());
    $("#networkDiv input").attr("disabled", "disabled");
    conn.on("open", function () {
        $("#networkDiv").hide();
        conn.send({
            type: "setName",
            name: $("#nickname").val()
        });
    });
    conn.on("data", function (data) {
        console.log(data);
    });
}
function init() {
    peer = new Peer({ host: host, port: port, path: path });
    peer.on("error", function (err) {
        if (err.type === "invalid-id" || err.type === "peer-unavailable") {
            console.log("Invalid Room Code");
            $("#networkDiv input").removeAttr("disabled");
        }
        else {
            throw err;
        }
    });
    peer.on("open", function (id) {
        console.log('My peer ID is: ' + id);
    });
    $("#connBtn").on("click", connect);
    $("#networkDiv").on("keypress", function (e) {
        (e.key === "Enter") ? $("#connBtn").click() : null;
    });
}
if (util.supports.data) {
    init();
}
else {
    console.log("Sorry, your browser version is not supported.");
}
//# sourceMappingURL=client.js.map