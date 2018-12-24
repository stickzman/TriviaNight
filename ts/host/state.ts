/// <reference path="../common.ts" />
abstract class State {
	public enter(): void { }
	public changeState(s: State): void { state = s; }
	public processData(data): void { }
}

class InitState extends State {
	public enter() {
		$("#menu").show();
	}

	public changeState(s: State) {
		$("#menu").hide();
		state = s;
	}
}
