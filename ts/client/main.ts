/// <reference path="../common.ts" />
let host: string = window.location.hostname;
let port: string = window.location.port;
let path: string = "/api";

let peer, conn, currScreen = $("#connectScreen");
let nickname: string, hue: number;

function connect() {
    if ($("#roomCode").val().length == 0) {
        console.log("Please enter a Room Code");
        return;
    }

    nickname = $("#nickname").val();

    conn = peer.connect($("#roomCode").val());
    $("#connectScreen input").attr("disabled", "disabled");

    //Set up click listeners for conn obj
    $("#startGame").on("click", () => {
        conn.send({ "type": "startGame"});
    });
    setMouseDown("#buzzerScreen", () => {
        conn.send({"type": "buzz"});
    });
    $(".answerBtn").on("click", function() {
        conn.send({
            "type": "answer",
            "message": $(this).html()
        });
    });


    conn.on("open", () => {
        currScreen.hide();
        currScreen = $("#begin").css("display", "flex");

        conn.send({
            "type": "setName",
            "name": $("#nickname").val()
        });
    });

    conn.on("close", () => {
        currScreen.hide();
        $("#banner").hide();
        $("#connectScreen input").removeAttr("disabled");
        currScreen = $("connectScreen").css("display", "flex");
    });

    conn.on("data", (data) => {
        switch (data.type) {
            case "enableBuzz":
                currScreen.hide();
                currScreen = $("#buzzerScreen").css("display", "flex");
                break;
            case "buzz": navigator.vibrate(300); break;
            case "ques":
                currScreen.hide();
                //Load quesion into div
                $("#question").html(data.message.ques);
                let answers = data.message.answers;
                let elems = $(".answerBtn");
                for (let i = 0; i < answers.length; i++) {
                    elems.next().html(answers[i]);
                }
                currScreen = $("#questionScreen").css("display", "flex");
                break;
        }
    });
}


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

    peer.on("open", (id) => {
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
