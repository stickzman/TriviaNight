/// <reference path="../common.ts" />
abstract class State {
	public processData(data, player: client): void {
		console.log("No data handler specified", data);
	}
	public enter(): State { return this; }
	public changeState(s: State): void { state = s; }
}

class InitState extends State {
	public enter(): State {
		$("#menu").show();
		return this;
	}

	public changeState(s: State) {
		$("#menu").hide();
		state = s.enter();
	}

	public processData(data, player: client) {
		if (data.type === "startGame") {
			this.changeState(new PreQuesState());
		}
	}
}

class PreQuesState extends State {
	public enter(): State {
		$("#PreQuesState").show();
		return this;
	}
}
