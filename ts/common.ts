declare var jQuery: any;
declare var $: any;
declare var Peer: any;
declare var util: any;

function shuffle(arr: any[]) {
	let t, j;
	for (let i = arr.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		t = arr[i];
		arr[i] = arr[j];
		arr[j] = t;
	}
}

function setMouseDown(selector: string, callbackFunc: Function) {
	if (window.onpointerdown === undefined) {
		$(selector).on("mousedown", callbackFunc);
		$(selector).on("touchdown", callbackFunc);
	} else {
		$(selector).on("pointerdown", callbackFunc);
	}
}

function setMouseUp(selector: string, callbackFunc: Function) {
	if (window.onpointerup === undefined) {
		$(selector).on("mouseup", callbackFunc);
		$(selector).on("touchup", callbackFunc);
	} else {
		$(selector).on("pointerup", callbackFunc);
	}
}
