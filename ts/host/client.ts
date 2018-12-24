class Client {
	public elem;

	constructor(public conn, private _name: string = "", private _score: number = 0) {
		this.elem = $(`<div id="pID_${conn.id}"><p class="name">${_name}</p><p class="score">${_score}</p></div>`).css("padding", "0px 10px");
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
}
