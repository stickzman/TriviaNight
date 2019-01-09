function setColor(h: number) {
    if (h > 360) h = 360;
    if (h < 0) h = 0;
    hue = h;
    $("#banner").css("background-color", 'hsl(' + hue + ', 100%, 50%)');
    //Set text color based on luminance of background
    let rgb = $("#banner").css("background-color").replace(/[^,\d]/g,"").split(",");
    let lum = (rgb[0] * 299 + rgb[1] * 587 + rgb[2] * 114) / 1000;
    $("#banner").css("color", (lum > 125) ? "black" : "white");
}
