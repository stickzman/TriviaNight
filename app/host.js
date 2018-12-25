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
function shuffle(arr) {
    var t, j;
    for (var i = arr.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        t = arr[i];
        arr[i] = arr[j];
        arr[j] = t;
    }
}
var Client = /** @class */ (function () {
    function Client(conn, _name, _score) {
        if (_name === void 0) { _name = ""; }
        if (_score === void 0) { _score = 0; }
        var _this = this;
        this.conn = conn;
        this._name = _name;
        this._score = _score;
        this.elem = $("<div id=\"pID_" + conn.id + "\"><p class=\"name\">" + _name + "</p><p class=\"score\">" + _score + "</p></div>");
        this.elem.appendTo("#pList");
        conn.on("data", function (data) {
            if (data.type === "setName") {
                _this.name = data.name;
            }
        });
        conn.on("close", function () { _this.elem.remove(); });
    }
    Object.defineProperty(Client.prototype, "name", {
        get: function () {
            return this._name;
        },
        set: function (n) {
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
            this._score = s;
            this.elem.find(".score").html(s);
        },
        enumerable: true,
        configurable: true
    });
    return Client;
}());
/// <reference path="../common.ts" />
var State = /** @class */ (function () {
    function State() {
    }
    State.prototype.processData = function (data, player) {
        console.log("No data handler specified", data);
    };
    State.prototype.enter = function () { return this; };
    State.prototype.changeState = function (s) { state = s.enter(); };
    return State;
}());
var InitState = /** @class */ (function (_super) {
    __extends(InitState, _super);
    function InitState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    InitState.prototype.enter = function () {
        $("#menu").show();
        return this;
    };
    InitState.prototype.changeState = function (s) {
        $("#menu").hide();
        _super.prototype.changeState.call(this, s);
    };
    InitState.prototype.processData = function (data, player) {
        if (data.type === "startGame") {
            this.changeState(new LoadQues());
        }
    };
    return InitState;
}(State));
var LoadQues = /** @class */ (function (_super) {
    __extends(LoadQues, _super);
    function LoadQues() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    LoadQues.prototype.enter = function () {
        var _this = this;
        getNextQuestion().then(function (obj) {
            _this.changeState(new QuestionState(obj));
        });
        return this;
    };
    return LoadQues;
}(State));
var QuestionState = /** @class */ (function (_super) {
    __extends(QuestionState, _super);
    function QuestionState(ques) {
        var _this = _super.call(this) || this;
        _this.ques = ques;
        _this.allowBuzz = false;
        _this.answers = ques.incorrect_answers.slice();
        _this.answers.push(ques.correct_answers);
        shuffle(_this.answers);
        console.log(ques);
        return _this;
    }
    QuestionState.prototype.enter = function () {
        var _this = this;
        $("#difficulty").html(this.ques.difficulty);
        $("#category").html(this.ques.category);
        $("#questionInfo").show();
        setTimeout(function () {
            $("ques").html(_this.ques.question);
            $("#questionInfo").hide();
            $("#questionScreen").show();
            _this.allowBuzz = true;
        }, 5000);
        return this;
    };
    return QuestionState;
}(State));
/// <reference path="../common.ts" />
/// <reference path="client.ts" />
/// <reference path="state.ts" />
var host = window.location.hostname;
var port = window.location.port;
var path = "/api";
var peer, state = new InitState().enter();
var clients = [];
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
            $("#roomCode").html(err); //Display error
            throw err;
        }
    });
}
function onConnect(conn) {
    var client = new Client(conn);
    clients.push(client);
    conn.on("data", function (data) { state.processData(data, client); });
    conn.on("close", function () {
        clients = clients.filter(function (c) { return c !== client; });
    });
}
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