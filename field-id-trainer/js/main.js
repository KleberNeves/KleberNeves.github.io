loadData = function() {
    d3.dsv(";", "/data/sampledb.csv").then(function(data) {
      paper_data = data;
    });
}

pressEnter = function() {
    if (paper_data == undefined) {
        console.log("Data not loaded yet.")
        return (0)
    }

    var all_fields = ["Life Sciences", "Physics", "Chemistry", "Computer Science", "Mathematics", "Geosciences"];

    // If a new question is required
    if (is_new_question) {
        is_new_question = false

        // Change button to "Check Answer"
        btn_enter.innerHTML = "Check answer";

        // Change feedback p to "Which field is this?"
        feedback_text.innerHTML = "Which field is this?";

        // Pick the field, if it's not picked by the user
        current_area = field_selector.value;
        if (current_area == "ALL") {
            current_area = all_fields[Math.floor(Math.random() * all_fields.length)];
        }


        // Keep only selected field
        df = paper_data.filter( function(d) {
            return (d.area == current_area);
        });

        // Pick a random row to be the question
        var r = Math.floor(Math.random() * df.length);
        var newTI = df[r].title;
        var newAB = df[r].abstract;
        var correct_alt = df[r].field;

        // Get unique options
        var all_possible_fields = d3.map(df, function(d){return(d.field)})
        var possible_opts = [...new Set(all_possible_fields)];
        
        // Remove correct one
        let s = possible_opts.indexOf(correct_alt);
        possible_opts.splice(s, 1);

        // Pick other 3 subfields to be the alternatives
        possible_opts = d3.shuffle(possible_opts);
        possible_opts = possible_opts.slice(0,3);

        var final_alts = d3.shuffle(possible_opts.concat([correct_alt]));
        correct_index = final_alts.indexOf(correct_alt);

        // Update the text of the title/question
        paper_title.innerHTML = newTI;
        paper_abstract.innerHTML = newAB + " (...)";

        // Update the text of the alternatives
        for (var i = 0; i <= 3; i++) {
            radio_text[i].firstChild.textContent = final_alts[i];
            radio_text[i].classList.remove('wrongAnswer');
            radio_text[i].classList.remove('correctAnswer');
        }

    } else { // If an answer is to be checked
        is_new_question = true

        // Change button to "New Paper"
        btn_enter.innerHTML = "New paper";

        // Define if it's right or wrong
        var selected_alt = document.querySelector('input[name="options"]:checked').value;
        
        var is_correct = (correct_index.toString() == selected_alt);
        
        // Color the options according to right or wrong
        if (is_correct) {
            radio_text[correct_index].classList.add('correctAnswer');
        } else {
            radio_text[correct_index].classList.add('correctAnswer');
            radio_text[parseInt(selected_alt)].classList.add('wrongAnswer');
        }

        // Change feedback text to right or wrong
        if (is_correct) {
            feedback_text.innerHTML = "<span class='rightfb'>RIGHT</span>";
        } else {
            feedback_text.innerHTML = "<span class='wrongfb'>WRONG</span>";
        }

        // Update stats
        console.log(summary_data)
        var row_i = all_fields.indexOf(current_area) + 1
        summary_data[row_i].questions ++
        summary_data[7].questions ++

        if (is_correct) {
            summary_data[row_i].correct ++
            summary_data[7].correct ++
        }
        
        summary_data[row_i].perc = Math.round(100 * summary_data[row_i].correct / summary_data[row_i].questions) + " %"
        summary_data[7].perc = Math.round(100 * summary_data[7].correct / summary_data[7].questions) + " %"
        updateTable (summary_data)
    }

}

function updateTable(data) {
  var rows = tableBody.selectAll("tr").data(data);
  rows.exit().remove();
  rows = rows.enter().append("tr").merge(rows);

  var cells = rows.selectAll("td")
    .data(function(d, i) {
      return Object.values(d);
    });
  cells.exit().remove();
  cells.enter().append("td")
    .text(function(d) {
      return d;
    });
  cells.text(function(d) {
    return d;
  });
}

var paper_data;
var correct_index;
var current_area;


window.onload = loadData();

var paper_title = document.querySelector("#paper_title");
var paper_abstract = document.querySelector("#paper_abstract");

var summary_data = [
    {"field": "Field", "questions": "# Questions", "correct": "# Correct", "perc": "% Correct"},
    {"field": "Life Sciences", "questions": 0, "correct": 0, "perc": "0 %"},
    {"field": "Physics", "questions": 0, "correct": 0, "perc": "0 %"},
    {"field": "Chemistry", "questions": 0, "correct": 0, "perc": "0 %"},
    {"field": "Computer Science", "questions": 0, "correct": 0, "perc": "0 %"},
    {"field": "Mathematics", "questions": 0, "correct": 0, "perc": "0 %"},
    {"field": "Geosciences", "questions": 0, "correct": 0, "perc": "0 %"},
    {"field": "Overall", "questions": 0, "correct": 0, "perc": "0 %"}
]


var radio_text = [
  document.querySelector("#lopt0"),
  document.querySelector("#lopt1"),
  document.querySelector("#lopt2"),
  document.querySelector("#lopt3")
]

var feedback_text = document.querySelector("#feedback");
var field_selector = document.querySelector("#select_field");
var btn_enter = document.querySelector("#btn_enter");

btn_enter.addEventListener("click", pressEnter);

var is_new_question = true;

var tableBody = d3.select("#statsTable")