var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var Client = /** @class */ (function () {
    function Client(conn, _name, _score, _hue) {
        if (_name === void 0) { _name = ""; }
        if (_score === void 0) { _score = 0; }
        var _this = this;
        this.conn = conn;
        this._name = _name;
        this._score = _score;
        this._hue = _hue;
        this.MAX_HEIGHT = 225; //in pixels
        this.MIN_HEIGHT = 52; //in pixels
        this.elem = $("<div id=\"pID_" + conn.id + "\"><p class=\"name\">" + _name + "</p><p class=\"score\">" + _score + "</p></div>");
        if (_hue !== undefined)
            this.hue = _hue;
        this.elem.appendTo("#pList");
        conn.on("data", function (data) {
            if (data.type === "setName") {
                _this.name = data.message;
            }
        });
        conn.on("data", function (data) {
            if (data.type === "setColor") {
                _this.hue = data.message;
            }
        });
        conn.on("close", function () { _this.elem.remove(); });
    }
    Object.defineProperty(Client.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (n) {
            n = n.toUpperCase();
            this._name = n;
            this.elem.find(".name").html(n);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Client.prototype, "score", {
        get: function () {
            return this._score;
        },
        set: function (s) {
            if (s < 0)
                s = 0;
            this._score = s;
            var p = s / MAX_SCORE;
            if (p > 1)
                p = 1;
            var h = this.MIN_HEIGHT + p * (this.MAX_HEIGHT - this.MIN_HEIGHT);
            this.elem.css("height", h + "px").find(".score").html(s);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Client.prototype, "hue", {
        get: function () {
            return this._hue;
        },
        set: function (h) {
            if (h > 360)
                h = 360;
            this._hue = h;
            this.elem.css("background-color", "hsl(" + h + ", 100%, 50%)");
            //Set text color based on luminance of background
            var rgb = this.elem.css("background-color").replace(/[^,\d]/g, "").split(",");
            var lum = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
            this.elem.css("color", (lum > 125) ? "black" : "white");
        },
        enumerable: true,
        configurable: true
    });
    return Client;
}());
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
var State = /** @class */ (function () {
    function State() {
    }
    State.prototype.processData = function (data, player) { };
    State.prototype.enter = function () { return this; };
    State.prototype.changeState = function (s) { state = s.enter(); };
    return State;
}());
var InitState = /** @class */ (function (_super) {
    __extends(InitState, _super);
    function InitState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InitState.prototype.processData = function (data, player) {
        if (data.type === "startGame") {
            this.changeState(new PreQues());
        }
    };
    InitState.prototype.enter = function () {
        $("#menu").show();
        return this;
    };
    InitState.prototype.changeState = function (s) {
        $("#menu").hide();
        _super.prototype.changeState.call(this, s);
    };
    return InitState;
}(State));
var PreQues = /** @class */ (function (_super) {
    __extends(PreQues, _super);
    function PreQues() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    PreQues.prototype.enter = function () {
        var _this = this;
        send({ "type": "enableBuzz" });
        getNextQuestion().then(function (ques) {
            switch (ques.difficulty.toLowerCase()) {
                case "easy":
                    $("#difficulty").css("color", "green").html("Easy");
                    break;
                case "medium":
                    $("#difficulty").css("color", "yellow").html("Medium");
                    break;
                case "hard":
                    $("#difficulty").css("color", "red").html("Hard");
                    break;
            }
            $("#category").html(ques.category);
            $("#questionInfo").show();
            setTimeout(function () {
                _this.changeState(new QuesState(ques));
            }, 2000);
        });
        return this;
    };
    PreQues.prototype.changeState = function (s) {
        $("#questionInfo").hide();
        _super.prototype.changeState.call(this, s);
    };
    return PreQues;
}(State));
var QuesState = /** @class */ (function (_super) {
    __extends(QuesState, _super);
    function QuesState(ques) {
        var _this = _super.call(this) || this;
        _this.ques = ques;
        _this.allowBuzz = true;
        _this.penalizeBuzz = false;
        _this.correctAnswer = ques.correct_answer;
        switch (ques.difficulty.substr(0, 1)) {
            case "e":
                _this.quesVal = 10;
                break;
            case "m":
                _this.quesVal = 20;
                break;
            case "h":
                _this.quesVal = 30;
                break;
        }
        return _this;
    }
    QuesState.prototype.processData = function (data, player) {
        var _this = this;
        if (data.type === "buzz") {
            if (this.allowBuzz) {
                this.allowBuzz = false;
                this.currPlayer = player;
                //$("#questionScreen").css("background-color", `hsl(${player.hue}, 100%, 80%)`);
                player.conn.send({ "type": "buzz", "message": "300" });
                player.conn.send({
                    "type": "ques",
                    "message": {
                        "ques": this.ques.question,
                        "answers": this.answers
                    }
                });
                this.buzzTimeout = setTimeout(function () { _this.penalizeBuzz = true; }, 3000);
            }
            else if (this.penalizeBuzz) {
                player.score -= 10;
            }
        }
        else if (data.type === "answer") {
            if (player === this.currPlayer) {
                if (data.message === this.correctAnswer) {
                    player.score += this.quesVal;
                    if (player.score >= MAX_SCORE) {
                        this.changeState(new WinState(player));
                    }
                    else {
                        this.changeState(new PreQues());
                    }
                }
                else {
                    this.currPlayer = null;
                    player.conn.send({ "type": "buzz", "message": "1000" });
                    player.score -= this.quesVal;
                    clearTimeout(this.buzzTimeout);
                    this.penalizeBuzz = false;
                    this.allowBuzz = true;
                    this.changeState(new PreQues());
                }
            }
        }
    };
    QuesState.prototype.enter = function () {
        this.answers = this.ques.incorrect_answers.slice();
        this.answers.push(this.ques.correct_answer);
        shuffle(this.answers);
        $("#ques").html(this.ques.question);
        var elem = $("#answers > ul").html("");
        this.answers.forEach(function (e) {
            elem.append("<li>" + e + "</li>");
        });
        $("#questionScreen").show();
        return this;
    };
    QuesState.prototype.changeState = function (s) {
        $("#questionScreen").hide();
        _super.prototype.changeState.call(this, s);
    };
    return QuesState;
}(State));
var WinState = /** @class */ (function (_super) {
    __extends(WinState, _super);
    function WinState(winner) {
        var _this = _super.call(this) || this;
        _this.winner = winner;
        return _this;
    }
    WinState.prototype.enter = function () {
        $("#winDiv").css("color", "hsl(" + this.winner.hue + ", 100%, 50%)").html(this.winner.name);
        $("#winScreen").show();
        this.winner.conn.send({ "type": "win" });
        send({ "type": "playAgain" });
        return this;
    };
    WinState.prototype.processData = function (data, player) {
        if (data.type === "startGame") {
            clients.forEach(function (c) {
                c.score = 0;
            });
            this.changeState(new PreQues());
        }
    };
    WinState.prototype.changeState = function (s) {
        $("#winScreen").hide();
        _super.prototype.changeState.call(this, s);
    };
    return WinState;
}(State));
/// <reference path="../common.ts" />
/// <reference path="client.ts" />
/// <reference path="state.ts" />
var host = window.location.hostname;
var port = window.location.port;
var path = "/api";
var peer, state = new InitState().enter();
var MAX_SCORE = 100;
var clients = [];
//API Set up --------------------------
var sessionToken = localStorage.getItem("sessionToken");
if (sessionToken === null) {
    getNewToken();
}
function getNewToken() {
    return __awaiter(this, void 0, void 0, function () {
        var data;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, jQuery.getJSON("https://opentdb.com/api_token.php?command=request")];
                case 1:
                    data = _a.sent();
                    console.log(data.response_message);
                    sessionToken = data.token;
                    localStorage.setItem("sessionToken", sessionToken);
                    return [2 /*return*/];
            }
        });
    });
}
function resetToken() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, jQuery.getJSON("https://opentdb.com/api_token.php?command=reset&token=" + sessionToken)];
                case 1:
                    _a.sent();
                    console.log("All questions seen, resetting session token...");
                    return [2 /*return*/];
            }
        });
    });
}
function getNextQuestion() {
    return __awaiter(this, void 0, void 0, function () {
        var res, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, jQuery.getJSON("https://opentdb.com/api.php?amount=1&type=multiple&token=" + sessionToken)];
                case 1:
                    res = _b.sent();
                    _a = res.response_code;
                    switch (_a) {
                        case 0: return [3 /*break*/, 2];
                        case 1: return [3 /*break*/, 3];
                        case 2: return [3 /*break*/, 4];
                        case 3: return [3 /*break*/, 5];
                        case 4: return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 9];
                case 2: return [2 /*return*/, res.results[0]];
                case 3:
                    console.error("Open Trivia DB: Search found no results.");
                    return [2 /*return*/, null];
                case 4:
                    console.error("Open Trivia DB: Invalid query parameters.");
                    return [2 /*return*/, null];
                case 5: return [4 /*yield*/, getNewToken()];
                case 6:
                    _b.sent();
                    return [2 /*return*/, getNextQuestion()];
                case 7: return [4 /*yield*/, resetToken()];
                case 8:
                    _b.sent();
                    return [2 /*return*/, getNextQuestion()];
                case 9: return [2 /*return*/, res.results[0]];
            }
        });
    });
}
//--------------------------------------
function onConnect(conn) {
    var client = new Client(conn);
    clients.push(client);
    conn.on("data", function (data) { state.processData(data, client); });
    conn.on("close", function () {
        clients = clients.filter(function (c) { return c !== client; });
    });
}
function init() {
    var id = Math.floor((Math.random() * 10000)).toString().padStart(4, "0");
    peer = new Peer(id, { host: host, port: port, path: path });
    peer.on("open", function (id) {
        $("#roomCode").append(id);
    });
    peer.on("connection", onConnect);
    peer.on("error", function (err) {
        if (err.type === "unavailable-id") {
            init(); //Generate a new random ID and try again
        }
        else {
            //Display error
            $("#roomCode").css("font-size", "35pt").css("color", "red").html(err);
            throw err;
        }
    });
}
//Send data to all clients
function send(data) {
    clients.forEach(function (client) { client.conn.send(data); });
}
if (util.supports.data) {
    init();
}
else {
    console.log("Sorry, your browser version is not supported.");
}
//# sourceMappingURL=host.js.map