class Client {
	public elem;

	constructor(public conn, private _name: string = "", private _score: number = 0, private _hue: number = Math.floor(Math.random() * 361)) {
		this.elem = $(`<div id="pID_${conn.id}"><p class="name">${_name}</p><p class="score">${_score}</p></div>`);
		this.hue = _hue;
		this.elem.appendTo("#pList");

		conn.on("data", (data) => {
	        if (data.type === "setName") {
	            this.name = data.name;
	        }
	    });

		conn.on("close", () => { this.elem.remove(); });
	}

	get name(): string {
		return this._name;
	}

	set name(n: string) {
		this._name = n;
		this.elem.find(".name").html(n);
	}

	get score(): number {
		return this._score;
	}

	set score(s: number) {
		this._score = s;
		this.elem.find(".score").html(s);
	}

	get hue() {
		return this._hue;
	}

	set hue(h: number)  {
		if (h > 360) h = 360;
		this._hue = h;
		this.elem.css("background-color", `hsl(${h}, 100%, 50%)`);
		//Set text color based on luminance of background
		let rgb = this.elem.css("background-color").replace(/[^,\d]/g,"").split(",");
		let lum = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
		this.elem.css("color", (lum > 125) ? "black" : "white");
	}
}
