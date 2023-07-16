loadData = function() {
    d3.csv("./data/char-data.csv").then(function(data) {
        charAllData = data;
    });
    d3.csv("./data/task-data.csv").then(function(data) {
        taskAllData = data;
    });
}

filterData = function(df) {
    var checkedCategories = document.querySelectorAll('input[name="categories"]:checked');
    var checkedLabels = Array.from(checkedCategories).map((checkbox) => checkbox.nextElementSibling.textContent);

    var filteredData = df.filter(function(d) {
        return checkedLabels.includes(d.category);
    });

    return filteredData;
};

generateArgument = function() {
    var charData = filterData(charAllData);
    var taskData = filterData(taskAllData);
    
    var cards1 = d3.shuffle(charData).slice(0, 5).map(d => d.character);
    var cards2 = d3.shuffle(charData).slice(0, 5).map(d => d.character);
    
    var selected_task = taskData[Math.floor(Math.random() * taskData.length)].task

    pcards1.innerHTML = cards1.join("<br>")
    pcards2.innerHTML = cards2.join("<br>")
    ptask.innerHTML = selected_task
}

window.onload = loadData();

pcards1 = document.querySelector("#cards1_text");
pcards2 = document.querySelector("#cards2_text");
ptask = document.querySelector("#task_text");

btn_new = document.querySelector("#btn_new");

btn_new.addEventListener("click", generateArgument);
