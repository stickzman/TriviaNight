/// <reference path="../common.ts" />
abstract class State {
	public processData(data, player: Client): void { }
	public enter(): State { return this; }
	public changeState(s: State): void { state = s.enter(); }
}

class InitState extends State {
	public processData(data, player: Client) {
		if (data.type === "startGame") {
			this.changeState(new PreQues());
		}
	}

	public enter(): State {
		$("#menu").show();
		return this;
	}

	public changeState(s: State) {
		$("#menu").hide();
		super.changeState(s);
	}
}

class PreQues extends State {
	public enter(): State {
		send({"type": "enableBuzz"});
		getNextQuestion().then((ques) => {
			switch(ques.difficulty.toLowerCase()) {
				case "easy": $("#difficulty").css("color", "green").html("Easy"); break;
				case "medium": $("#difficulty").css("color", "yellow").html("Medium"); break;
				case "hard": $("#difficulty").css("color", "red").html("Hard"); break;
			}
			$("#category").html(ques.category);
			$("#questionInfo").show();

			setTimeout(() => {
				this.changeState(new QuesState(ques));
			}, 2000);
		});

		return this;
	}

	public changeState(s: State) {
		$("#questionInfo").hide();
		super.changeState(s);
	}
}

class QuesState extends State {
	private allowBuzz: boolean = true;
	private penalizeBuzz: boolean = false;
	private buzzTimeout; //Timer to set penalizeBuzz
	private answers: string[];
	private correctAnswer: string;
	private currPlayer: Client;
	private quesVal: number;

	constructor(private ques) {
		super();
		this.correctAnswer = ques.correct_answer;
		switch (ques.difficulty.substr(0, 1)) {
			case "e": this.quesVal = 10; break;
			case "m": this.quesVal = 20; break;
			case "h": this.quesVal = 30; break;
		}
	}

	public processData(data, player: Client) {
		if (data.type === "buzz") {
			if (this.allowBuzz) {
				this.allowBuzz = false;
				this.currPlayer = player;
				//$("#questionScreen").css("background-color", `hsl(${player.hue}, 100%, 80%)`);
				player.conn.send({"type": "buzz", "message": "300"});
				player.conn.send({
					"type": "ques",
					"message": {
						"ques": this.ques.question,
						"answers": this.answers
					}
				});
				this.buzzTimeout = setTimeout(() => { this.penalizeBuzz = true; }, 3000);
			} else if (this.penalizeBuzz) {
				player.score -= 10;
			}
		} else if (data.type === "answer") {
			if (player === this.currPlayer) {
				if (data.message === this.correctAnswer) {
					player.score += this.quesVal;
					if (player.score >= MAX_SCORE) {
						this.changeState(new WinState(player));
					} else {
						this.changeState(new PreQues());
					}
				} else {
					this.currPlayer = null;
					player.conn.send({"type": "buzz", "message": "1000"});
					player.score -= this.quesVal;
					clearTimeout(this.buzzTimeout);
					this.penalizeBuzz = false;
					this.allowBuzz = true;
					this.changeState(new PreQues());
				}
			}
		}
	}

	public enter() {
		this.answers = this.ques.incorrect_answers.slice();
		this.answers.push(this.ques.correct_answer);
		shuffle(this.answers);

		$("#ques").html(this.ques.question);
		let elem = $("#answers > ul").html("");
		this.answers.forEach(e => {
			elem.append(`<li>${e}</li>`);
		});
		$("#questionScreen").show();

		return this;
	}

	public changeState(s: State) {
		$("#questionScreen").hide();
		super.changeState(s);
	}
}

class WinState extends State {
	constructor(private winner: Client) {
		super();
	}

	public enter() {
		$("#winDiv").css("color", `hsl(${this.winner.hue}, 100%, 50%)`).html(this.winner.name);
		$("#winScreen").show();
		this.winner.conn.send({"type": "win"});
		send({"type": "playAgain"});

		return this;
	}

	public processData(data, player: Client) {
		if (data.type === "startGame") {
			clients.forEach(c => {
				c.score = 0;
			});
			this.changeState(new PreQues());
		}
	}

	public changeState(s: State) {
		$("#winScreen").hide();
		super.changeState(s);
	}
}
