//Set event strings to be used by jQuery
var MOUSE_DOWN = (window.onpointerdown !== undefined) ? "pointerdown" : "mousedown touchdown";
var MOUSE_UP = (window.onpointerup !== undefined) ? "pointerup" : "mouseup touchup";
//Shuffle array
function shuffle(arr) {
    var t, j;
    for (var i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
    }
}
function decodeHTML(html) {
    var txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
}
;
//Return a function that constructs a Promise which waits specified ms to resolve
function delay(duration) {
    return function () {
        return new Promise(function (resolve) {
            setTimeout(function () { resolve(); }, duration);
        });
    };
}
function setColor(h) {
    if (h > 360)
        h = 360;
    if (h < 0)
        h = 0;
    hue = h;
    $("#banner").css("background-color", 'hsl(' + hue + ', 100%, 50%)');
    //Set text color based on luminance of background
    var rgb = $("#banner").css("background-color").replace(/[^,\d]/g, "").split(",");
    var lum = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    $("#banner").css("color", (lum > 125) ? "black" : "white");
}
/// <reference path="../common.ts" />
/// <reference path="helper.ts" />
function connect() {
    if ($("#roomCode").val().length == 0) {
        console.log("Please enter a Room Code");
        return;
    }
    conn = peer.connect($("#roomCode").val());
    $("#connectScreen input").attr("disabled", "disabled");
    //Set up click listeners for conn obj
    $("#startGame").on("click", function () {
        conn.send({ "type": "startGame" });
    });
    $("#buzzerScreen").on(MOUSE_DOWN, function () {
        conn.send({ "type": "buzz" });
    });
    $(".answerBtn").on(MOUSE_DOWN, function () {
        conn.send({
            "type": "answer",
            "message": $(this).text()
        });
    });
    $("#playAgain").on(MOUSE_DOWN, function () {
        conn.send({ "type": "startGame" });
    });
    conn.on("open", function () {
        currScreen.hide();
        currScreen = $("#begin").css("display", "flex");
        $("#banner").html($("#nickname").val().toUpperCase()).css("display", "flex");
        conn.send({
            "type": "setName",
            "message": $("#nickname").val()
        });
        setColor(Math.floor(Math.random() * 361));
        conn.send({
            "type": "setColor",
            "message": hue
        });
    });
    conn.on("close", function () {
        alert("Connection to host lost");
        window.location.reload();
    });
    conn.on("data", function (data) {
        switch (data.type) {
            case "enableBuzz":
                $("#winDiv").hide();
                currScreen.hide();
                currScreen = $("#buzzerScreen").css("display", "flex");
                break;
            case "buzz":
                navigator.vibrate(data.message);
                break;
            case "ques":
                //Load quesion into div
                $("#question").html(data.message.ques);
                var answers = data.message.answers;
                var elems = $(".answerBtn");
                for (var i = 0; i < answers.length; i++) {
                    elems[i].innerText = decodeHTML(answers[i]);
                }
                currScreen.hide();
                currScreen = $("#questionScreen").css("display", "flex");
                break;
            case "win":
                currScreen.hide();
                $("#winDiv").show();
                break;
            case "playAgain":
                currScreen.hide();
                currScreen = $("#gameOverScreen").css("display", "flex");
                break;
        }
    });
}
/// <reference path="../common.ts" />
/// <reference path="helper.ts" />
/// <reference path="connection.ts" />
var host = window.location.hostname;
var port = window.location.port;
var path = "/api";
var peer, conn, currScreen = $("#connectScreen");
var hue;
function init() {
    peer = new Peer({ host: host, port: port, path: path });
    peer.on("error", function (err) {
        if (err.type === "invalid-id" || err.type === "peer-unavailable") {
            alert("Invalid Room Code");
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