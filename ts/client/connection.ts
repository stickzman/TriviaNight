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
    $("#startGame").on("click", () => {
        conn.send({ "type": "startGame"});
    });
    $("#buzzerScreen").on(MOUSE_DOWN, () => {
        conn.send({"type": "buzz"});
    });
    $(".answerBtn").on(MOUSE_DOWN, function() {
        conn.send({
            "type": "answer",
            "message": $(this).text()
        });
    });
    $("#playAgain").on(MOUSE_DOWN, () => {
        conn.send({ "type": "startGame"});
    });


    conn.on("open", () => {
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

    conn.on("close", () => {
        alert("Connection to host lost");
        window.location.reload();
    });

    conn.on("data", (data: DataPackage) => {
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
                let answers = data.message.answers;
                let elems = $(".answerBtn");
                for (let i = 0; i < answers.length; i++) {
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
