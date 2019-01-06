/// <reference path="../common.ts" />
abstract class State {
	public processData(data, player: Client): void {
		console.log("No data handler specified", data);
	}
	public enter(): State { return this; }
	public changeState(s: State): void { state = s.enter(); }
}

class InitState extends State {
	public enter(): State {
		$("#menu").show();
		return this;
	}

	public changeState(s: State) {
		$("#menu").hide();
		super.changeState(s);
	}

	public processData(data, player: Client) {
		if (data.type === "startGame") {
			this.changeState(new PreQues());
		}
	}
}

class PreQues extends State {
	public enter(): State {
		getNextQuestion().then((ques) => {
			switch(ques.difficulty.toLowerCase()) {
				case "easy": $("#difficulty").css("color", "green").html("Easy"); break;
				case "medium": $("#difficulty").css("color", "yellow").html("Medium"); break;
				case "hard": $("#difficulty").css("color", "red").html("Hard"); break;
			}
			$("#category").html(ques.category);
			$("#questionInfo").show();

			setTimeout(() => {
				$("#questionInfo").hide();
				this.changeState(new QuesState(ques));
			}, 5000);
		});

		return this;
	}
}

class QuesState extends State {
	private correctAnswer: string;

	constructor(private ques) {
		super();
		this.correctAnswer = ques.correct_answer;
	}

	public enter() {
		let answers = this.ques.incorrect_answers.slice();
		answers.push(this.ques.correct_answer);
		shuffle(answers);

		$("#ques").html(this.ques.question);
		let elem = $("#answers > ul").html("");
		answers.forEach(e => {
			elem.append(`<li>${e}</li>`);
		});
		$("#questionScreen").show();

		return this;
	}

}
