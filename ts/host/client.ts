class Client {
	public elem;
	readonly MAX_HEIGHT = 25; //in vh
	readonly MIN_HEIGHT = 8;  //in vh

	constructor(public conn, public _name: string = "", public _score: number = 0, public _hue?: number) {
		this.elem = $(`<div id="pID_${conn.id}"><p class="name">${_name}</p><p class="score">${_score}</p></div>`);
		if (_hue !== undefined) this.hue = _hue;
		this.elem.appendTo("#pList");

		conn.on("data", (data) => {
	        if (data.type === "setName") {
	            this.name = data.message;
	        }
	    });
		conn.on("data", (data) => {
	        if (data.type === "setColor") {
	            this.hue = data.message;
	        }
	    });

		conn.on("close", () => { this.elem.remove(); });
	}

	get name(): string {
		return this._name;
	}

	set name(n: string) {
		n = n.toUpperCase();
		this._name = n;
		this.elem.find(".name").html(n);
	}

	get score(): number {
		return this._score;
	}

	set score(s: number) {
		if (s < 0) s = 0;
		this._score = s;
		let p = s/MAX_SCORE;
		if (p > 1) p = 1;
		let h = this.MIN_HEIGHT + p * (this.MAX_HEIGHT - this.MIN_HEIGHT);
		this.elem.css("height", h + "vh").find(".score").html(s);
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
