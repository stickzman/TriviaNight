function shuffle(arr) {
    var t, j;
    for (var i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
    }
}
function setMouseDown(selector, callbackFunc) {
    if (window.onpointerdown === undefined) {
        $(selector).on("mousedown", callbackFunc);
        $(selector).on("touchdown", callbackFunc);
    }
    else {
        $(selector).on("pointerdown", callbackFunc);
    }
}
function setMouseUp(selector, callbackFunc) {
    if (window.onpointerup === undefined) {
        $(selector).on("mouseup", callbackFunc);
        $(selector).on("touchup", callbackFunc);
    }
    else {
        $(selector).on("pointerup", callbackFunc);
    }
}
/// <reference path="../common.ts" />
var host = window.location.hostname;
var port = window.location.port;
var path = "/api";
var peer, conn, currScreen = $("#connectScreen");
var nickname, hue;
function connect() {
    if ($("#roomCode").val().length == 0) {
        console.log("Please enter a Room Code");
        return;
    }
    nickname = $("#nickname").val();
    conn = peer.connect($("#roomCode").val());
    $("#connectScreen input").attr("disabled", "disabled");
    //Set up click listeners for conn obj
    $("#startGame").on("click", function () {
        conn.send({ "type": "startGame" });
    });
    setMouseDown("#buzzerScreen", function () {
        conn.send({ "type": "buzz" });
    });
    $(".answerBtn").on("click", function () {
        conn.send({
            "type": "answer",
            "message": $(this).html()
        });
    });
    conn.on("open", function () {
        currScreen.hide();
        currScreen = $("#begin").css("display", "flex");
        conn.send({
            "type": "setName",
            "name": $("#nickname").val()
        });
    });
    conn.on("close", function () {
        currScreen.hide();
        $("#banner").hide();
        $("#connectScreen input").removeAttr("disabled");
        currScreen = $("connectScreen").css("display", "flex");
    });
    conn.on("data", function (data) {
        switch (data.type) {
            case "enableBuzz":
                currScreen.hide();
                currScreen = $("#buzzerScreen").css("display", "flex");
                break;
            case "buzz":
                navigator.vibrate(300);
                break;
            case "ques":
                currScreen.hide();
                //Load quesion into div
                $("#question").html(data.message.ques);
                var answers = data.message.answers;
                var elems = $(".answerBtn");
                for (var i = 0; i < answers.length; i++) {
                    elems.next().html(answers[i]);
                }
                currScreen = $("#questionScreen").css("display", "flex");
                break;
        }
    });
}
function init() {
    peer = new Peer({ host: host, port: port, path: path });
    peer.on("error", function (err) {
        if (err.type === "invalid-id" || err.type === "peer-unavailable") {
            console.log("Invalid Room Code");
            $("#connectScreen input").removeAttr("disabled");
        }
        else {
            throw err;
        }
    });
    peer.on("open", function (id) {
        console.log('My peer ID is: ' + id);
    });
    $("#connBtn").on("click", connect);
    $("#connectScreen").on("keypress", function (e) {
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