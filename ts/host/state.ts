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
			}, 5000);
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

	constructor(private ques) {
		super();
		this.correctAnswer = ques.correct_answer;
	}

	public processData(data, player: Client) {
		if (data.type === "buzz") {
			if (this.allowBuzz) {
				this.allowBuzz = false;
				this.currPlayer = player;
				player.conn.send({"type": "buzz"});
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
					player.score += 10;
					this.changeState(new PreQues());
				} else {
					this.currPlayer = null;
					player.score -= 10;
					clearTimeout(this.buzzTimeout);
					this.penalizeBuzz = false;
					this.allowBuzz = true;
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
		$("#winDiv").html(this.winner.name);
		$("#winScreen").show();

		return this;
	}
}
