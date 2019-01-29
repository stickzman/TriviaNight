declare var jQuery: any;
declare var $: any;
declare var Peer: any;
declare var util: any;

//Set event strings to be used by jQuery
const MOUSE_DOWN = (window.onpointerdown !== undefined) ? "pointerdown" : "mousedown touchdown";
const MOUSE_UP = (window.onpointerup !== undefined) ? "pointerup" : "mouseup touchup";

//Structure of data passed between peering clients
interface DataPackage {
	type: string,
	message?: any;
}

//Shuffle array
function shuffle(arr: any[]) {
	let t: any, j: number;
	for (let i = arr.length - 1; i > 0; i--) {
		j = Math.floor(Math.random() * (i + 1));
		t = arr[i];
		arr[i] = arr[j];
		arr[j] = t;
	}
}

function decodeHTML(html: string): string {
	var txt = document.createElement('textarea');
	txt.innerHTML = html;
	return txt.value;
};

//Return a function that constructs a Promise which waits specified ms to resolve
function delay(duration: number) {
	return () => {
		return new Promise((resolve) => {
			setTimeout(() => { resolve(); }, duration);
		});
	}
}
