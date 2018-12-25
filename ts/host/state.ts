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
			this.changeState(new LoadQues());
		}
	}
}

class LoadQues extends State {
	public enter(): State {
		getNextQuestion().then((obj) => {
			this.changeState(new QuestionState(obj));
		});

		return this;
	}
}

class QuestionState extends State {
	private allowBuzz: boolean = false;
	private answers: string[];

	constructor(private ques) {
		super();
		this.answers = ques.incorrect_answers.slice();
		this.answers.push(ques.correct_answers);
		console.log(ques);
	}

	public enter() {
		$("#difficulty").html(this.ques.difficulty);
		$("#category").html(this.ques.category);
		$("#questionInfo").show();

		setTimeout(() => {
			$("ques").html(this.ques.question);
			$("#questionInfo").hide();
			$("#questionScreen").show();
			this.allowBuzz = true;
		}, 5000);

		return this;
	}
}
