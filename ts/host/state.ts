/// <reference path="../common.ts" />
/// <reference path="helper.ts" />
abstract class State {
	public processData(data: DataPackage, player: Client): void { }
	public enter(): State { return this; }
	//Perform clean up, update current state to the new state, and
	//kickoff initial code of new state
	public changeState(s: State): void { state = s.enter(); }
}

//Main Menu Screen
class InitState extends State {
	public enter(): State {
		$("#menu").css("display", "flex");
		return this;
	}

	public processData(data: DataPackage, player: Client) {
		if (data.type === "startGame") {
			//Disconnect from peering server because
			//we're now connected to all clients for this game
			peer.disconnect();
			this.changeState(new PreQues()); //Load 1st Question
		}
	}

	public changeState(s: State) {
		$("#menu").hide();
		super.changeState(s);
	}
}

//Difficulty & Category Screen
class PreQues extends State {
	public enter(): State {
		send({"type": "enableBuzz"}); //Enable the player buzzers
		getNextQuestion()
		.then((ques: QuestionData) => {
			//Update the UI with difficulty & category name
			switch(ques.difficulty.toLowerCase()) {
				case "easy": $("#difficulty").css("color", "hsl(100, 75%, 50%)").html("Easy"); break;
				case "medium": $("#difficulty").css("color", "hsl(50, 100%, 55%)").html("Medium"); break;
				case "hard": $("#difficulty").css("color", "hsl(0, 75%, 50%)").html("Hard"); break;
			}
			$("#category").html(ques.category);
			$("#questionInfo").css("display", "flex");

			//Move to Question Screen after 2 seconds
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

//Question Screen
class QuesState extends State {
	private ignoreBuzz: boolean = false;
	private penalizeBuzz: boolean = false;
	private buzzTimeout: any; //Timer to set penalizeBuzz
	private answers: string[];
	private correctAnswer: string;
	private currPlayer: Client;
	private quesVal: number;

	constructor(private ques: QuestionData) {
		super();
		this.correctAnswer = ques.correct_answer;
		switch (ques.difficulty.substr(0, 1)) {
			case "e": this.quesVal = 10; break;
			case "m": this.quesVal = 20; break;
			case "h": this.quesVal = 30; break;
		}
	}

	public enter() {
		//Reveal question, shuffle the answers, and display
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

	public processData(data: DataPackage, player: Client) {
		if (data.type === "buzz") {
			if (this.ignoreBuzz) return;
			if (this.penalizeBuzz) {
				player.score -= 10;
			} else {
				this.ignoreBuzz = true;
				this.currPlayer = player;
				//Highlight viewport with current player's color
				$("#questionScreen").css("box-shadow", `inset 0 0 14vmin hsl(${player.hue}, 100%, 50%)`);
				//Vibrate phone of current player and send them the question
				player.conn.send({"type": "buzz", "message": "300"});
				player.conn.send({
					"type": "ques",
					"message": {
						"ques": this.ques.question,
						"answers": this.answers
					}
				});
				//Enter grace period before penalizing buzzes
				this.buzzTimeout = setTimeout(() => { this.penalizeBuzz = true; }, 2000);
			}
		} else if (data.type === "answer") {
			if (player === this.currPlayer) {
				this.currPlayer = null; //Protect against double submission
				let elem = $(`#answers > ul > li:contains(${data.message})`)
					.addClass("selected");
				if (data.message === this.correctAnswer) {
					//Start correct answer animation
					delay(2000)() //Wait 2 seconds
					.then(() => {
						elem.addClass("correct");
					})
					.then(delay(1500)) //Wait 1.5 seconds
					.then(() => {
						//Add points then load next question or show winner
						player.score += this.quesVal;
						clearTimeout(this.buzzTimeout); //Cancel penalizeBuzz timer
						if (player.score >= MAX_SCORE) {
							this.changeState(new WinState(player));
						} else {
							this.changeState(new PreQues());
						}
					});
				} else {
					//Start incorrect answer animation
					delay(2000)() //Wait 2 seconds
					.then(() => {
						elem.addClass("incorrect");
						player.conn.send({"type": "buzz", "message": "1000"});
					})
					.then(delay(1500))
					.then(() => {
						//Subtract points and load next question
						$("#questionScreen").css("box-shadow", "");
						player.score -= this.quesVal;
						clearTimeout(this.buzzTimeout); //Cancel penalizeBuzz timer
						this.penalizeBuzz = false;
						this.ignoreBuzz = false;
						this.changeState(new PreQues());
					});
				}
			}
		}
	}

	public changeState(s: State) {
		$("#questionScreen").css("box-shadow", "");
		$("#questionScreen").hide();
		super.changeState(s);
	}
}

//Winner/Start Over Screen
class WinState extends State {
	constructor(private winner: Client) {
		super();
	}

	public enter() {
		$("#winDiv").css("color", `hsl(${this.winner.hue}, 100%, 50%)`).html(this.winner.name);
		$("#winScreen").css("display", "flex");
		this.winner.conn.send({"type": "win"});
		send({"type": "playAgain"});

		return this;
	}

	public processData(data: DataPackage, player: Client) {
		if (data.type === "startGame") {
			//Reset player scores and load next question
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
