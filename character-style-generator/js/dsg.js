loadData = function() {
    d3.csv("./data/cartoon-data.csv").then(function(data) {
      cartoonAllData = data;
    });
}

makeYearStr = function(y1, y2) {
    if (y1 == y2) {
        y = "(" + y1 + ")";
    } else {
        y = "(" + y1 + "-" + y2 + ")";
    }
    return y;
}

filterDecade = function(df) {
    // if a decade is selected
    if (decade_selector.value != "any") {
        // define min and max according to selected decade
        switch (decade_selector.value) {
        case "10":
            var min_year = 2010, max_year = 2100;
            break;
        case "00":
            var min_year = 2000, max_year = 2009;
            break;
        case "90":
            var min_year = 1990, max_year = 1999;
            break;
        case "80":
            var min_year = 1980, max_year = 1989;
            break;
        case "70":
            var min_year = 1970, max_year = 1979;
            break;
        case "old":
            var min_year = 1900, max_year = 1969;
            break;
        }
        // filter
        df = df.filter( function(d) {
            return (d.start_year <= max_year & d.end_year >= min_year);
        });
    }
    return df
}

generateStyle = function() {
    var cartoonData = filterDecade(cartoonAllData);
    var r = Math.floor(Math.random() * cartoonData.length);
    var y = makeYearStr(cartoonData[r].start_year, cartoonData[r].end_year);
    var cartoon = cartoonData[r].cartoon_title;
    
    ptxt.innerHTML = "<span class='titles'>" + cartoon + " " + y + "</span>";
}

generateCharacter = function() {
    var cartoonData = filterDecade(cartoonAllData);
    var r = Math.floor(Math.random() * cartoonData.length);
    var cartoon = cartoonData[r].cartoon_title;
    var y = makeYearStr(cartoonData[r].start_year, cartoonData[r].end_year);
    var character = cartoonData[r].character;
    
    ptxt.innerHTML = "<span class='titles'>" + character + "</span><br>from <span class='titles'>" + cartoon + " " + y + "</span>";
}

generateBoth = function() {
    var cartoonData = filterDecade(cartoonAllData);
    var r_style = Math.floor(Math.random() * cartoonData.length);
    var cartoon_style = cartoonData[r_style].cartoon_title;
    var y_style = makeYearStr(cartoonData[r_style].start_year, cartoonData[r_style].end_year);

    var r_char = 0;
    var cartoon_char = cartoon_style;
    while (cartoon_char == cartoon_style) {
        r_char = Math.floor(Math.random() * cartoonData.length);
        cartoon_char = cartoonData[r_char].cartoon_title;
    }
    var character = cartoonData[r_char].character;
    var y_char = makeYearStr(cartoonData[r_char].start_year, cartoonData[r_char].end_year);

    ptxt.innerHTML = "<span class='titles'>" + character + "</span><br>from <span class='titles'>" + cartoon_char + " " + y_char + "</span><br>in the style of<br><span class='titles'>" + cartoon_style + " " + y_style + "</span>";
}

window.onload = loadData();

ptxt = document.querySelector("#gen_text");

decade_selector = document.querySelector("#decade-select");

btn_get_style = document.querySelector("#btn_get_style");
btn_get_both = document.querySelector("#btn_get_both");
btn_get_character = document.querySelector("#btn_get_character");

btn_get_style.addEventListener("click", generateStyle);
btn_get_character.addEventListener("click", generateCharacter);
btn_get_both.addEventListener("click", generateBoth);