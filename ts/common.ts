declare var jQuery: any;
declare var $: any;
declare var Peer: any;
declare var util: any;

const MOUSE_DOWN = (window.onpointerdown !== undefined) ? "pointerdown" : "mousedown touchdown";
const MOUSE_UP = (window.onpointerup !== undefined) ? "pointerup" : "mouseup touchup";

interface DataPackage {
	type: string,
	message?: any;
}

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
