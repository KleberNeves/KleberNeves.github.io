loadData = function() {
    d3.csv("./data/novelas.csv").then(function(data) {
        novelaData = data;
    });
}

rnd = function(x) {
	return x[Math.floor(Math.random() * x.length)]
}

generate_name = function(chosen_word) {
    var templates = [
		"O XXX YYY",
		"A XXX YYY",
		"OS XXX YYY",
		"AS XXX YYY",
		"O YYY XXX",
		"A YYY XXX",
		"OS YYY XXX",
		"AS YYY XXX",
		"XXX E XXX",
		"XXXs E XXXs",
		"NOME",
		"NOME, A XXX",
		"O XXX YYY",
		"A XXX YYY",
		"OS XXX YYY",
		"AS XXX YYY",
		"O YYY XXX",
		"A YYY XXX",
		"OS YYY XXX",
		"AS YYY XXX",
		"XXX E XXX",
		"XXXs E XXXs",
		"NOME",
		"NOME, A XXX",
		"O XXX YYY",
		"A XXX YYY",
		"OS XXX YYY",
		"AS XXX YYY"
    ]
    
	var template = rnd(templates);
	var name = ""

	switch (template) {
		case "O XXX YYY":
			var x = novelaData.map(d => d['NOME O']);
			var y1 = novelaData.map(d => d['O ADJ POST']);
			var y2 = novelaData.map(d => d['Q POST']);
			var y3 = novelaData.map(d => d['Q POST']);
			var y = y1.concat(y2)
			y = y.concat(y3)
			x = x.filter(item => item !== '')
    		y = y.filter(item => item !== '')
			name = "O " + rnd(x) + " " + rnd(y)
		break;
		case "A XXX YYY":
			var x = novelaData.map(d => d['NOME A']);
			var y1 = novelaData.map(d => d['A ADJ POST']);
			var y2 = novelaData.map(d => d['Q POST']);
			var y3 = novelaData.map(d => d['Q POST']);
			var y = y1.concat(y2)
			y = y.concat(y3)
			x = x.filter(item => item !== '')
    		y = y.filter(item => item !== '')
			name = "A " + rnd(x) + " " + rnd(y)
		break;
		case "OS XXX YYY":
			var x = novelaData.map(d => d['NOME OS']);
			var y1 = novelaData.map(d => d['OS ADJ POST']);
			var y2 = novelaData.map(d => d['Q POST']);
			var y3 = novelaData.map(d => d['Q POST']);
			var y = y1.concat(y2)
			y = y.concat(y3)
			x = x.filter(item => item !== '')
    		y = y.filter(item => item !== '')
			name = "Os " + rnd(x) + " " + rnd(y)
		break;
		case "AS XXX YYY":
			var x = novelaData.map(d => d['NOME AS']);
			var y1 = novelaData.map(d => d['AS ADJ POST']);
			var y2 = novelaData.map(d => d['Q POST']);
			var y3 = novelaData.map(d => d['Q POST']);
			var y = y1.concat(y2)
			y = y.concat(y3)
			x = x.filter(item => item !== '')
    		y = y.filter(item => item !== '')
			name = "As " + rnd(x) + " " + rnd(y)
		break;
		case "O YYY XXX":
			var x = novelaData.map(d => d['NOME O']);
			var y = novelaData.map(d => d['O ADJ PRE']);
			x = x.filter(item => item !== '')
    		y = y.filter(item => item !== '')
			name = "O " + rnd(y) + " " + rnd(x)
		break;
		case "A YYY XXX":
			var x = novelaData.map(d => d['NOME A']);
			var y = novelaData.map(d => d['A ADJ PRE']);
			x = x.filter(item => item !== '')
    		y = y.filter(item => item !== '')
			name = "A " + rnd(y) + " " + rnd(x)
		break;
		case "OS YYY XXX":
			var x = novelaData.map(d => d['NOME OS']);
			var y = novelaData.map(d => d['OS ADJ PRE']);
			x = x.filter(item => item !== '')
    		y = y.filter(item => item !== '')
			name = "Os " + rnd(y) + " " + rnd(x)
		break;
		case "AS YYY XXX":
			var x = novelaData.map(d => d['NOME AS']);
			var y = novelaData.map(d => d['AS ADJ PRE']);
			x = x.filter(item => item !== '')
    		y = y.filter(item => item !== '')
			name = "As " + rnd(y) + " " + rnd(x)
		break;
		case "XXX E XXX":
			var x1 = novelaData.map(d => d['NOME O']);
			var x2 = novelaData.map(d => d['NOME A']);
			var x = x1.concat(x2)
			x = x.filter(item => item !== '')
			name = rnd(x) + " e " + rnd(x)
		break;
		case "XXXs E XXXs":
			var x1 = novelaData.map(d => d['NOME OS']);
			var x2 = novelaData.map(d => d['NOME AS']);
			var x = x1.concat(x2)
			x = x.filter(item => item !== '')
			name = rnd(x) + " e " + rnd(x)
		break;
		case "NOME":
			var x = novelaData.map(d => d['PRÓPRIOS']);
			x = x.filter(item => item !== '')
			name = rnd(x)
		break;
		case "NOME, A XXX":
			var x = novelaData.map(d => d['PRÓPRIOS']);
			var y = novelaData.map(d => d['A ADJ POST']);
			x = x.filter(item => item !== '')
    		y = y.filter(item => item !== '')
			name = rnd(x) + ", a " + rnd(y)
		break;
	}
    console.log(template)
    console.log(name)
	return name
}

generate_genre = function() {
    var x = novelaData.map(d => d['CATEGORIAS']);
    x = x.filter(item => item !== '')
    return rnd(x)
}

generate_cast = function() {
    var x = novelaData.map(d => d['ATORES']);
    var y = novelaData.map(d => d['ATRIZES']);
    x = x.filter(item => item !== '')
    y = y.filter(item => item !== '')
    return rnd(x) + ", " + rnd(y) + " e participação de " + rnd(x.concat(y))
}

generate_author = function() {
    var x = novelaData.map(d => d['AUTORES']);
	x = x.filter(item => item !== '')
    return rnd(x)
}

generateBtnFn = function() {
    pName.innerHTML = generate_name();

	var details = ""    
    if (cbGenero.checked) {
        details += "Nova " + generate_genre()
        if (!cbAutor.checked && !cbElenco.checked) {
        	details += "."
        }
    } else if (cbAutor.checked) {
    	details += "Nova novela"
    }
    if (cbAutor.checked) {
    	if (cbGenero.checked) {
    		details += ","
    	}
        details += " de " + generate_author() + "."
    }
    if (cbElenco.checked) {
    	if (cbGenero.checked && !cbAutor.checked) {
    		details += "."
    	}
        details += " Com " + generate_cast() + "."
    }

    pDetails.innerHTML = details;
}

window.onload = loadData();

generateBtn = document.querySelector('#generateBtn');
generateBtn.addEventListener("click", generateBtnFn);

cbGenero = document.querySelector('#cb_genero')
cbElenco = document.querySelector('#cb_elenco')
cbAutor = document.querySelector('#cb_autor')

pName = document.querySelector('#name')
pDetails = document.querySelector('#details')
