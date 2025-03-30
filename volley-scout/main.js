let records = [];
let selectedPlayer = null;
let playerSummaries = [];
let actionSummaries = [];
let opponent_error_count = 0;

document.querySelectorAll(".player-select-btn").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".form-control")
      .forEach((input) => input.classList.remove("selected"));
    document
      .querySelectorAll(".player-select-btn")
      .forEach((input) => input.classList.remove("selected"));
    const playerInput = document.getElementById(
      button.getAttribute("data-player")
    );
    selectedPlayer = playerInput.value;
    playerInput.classList.add("selected");
    button.classList.add("selected");
  });
});

document.querySelectorAll(".action-btn").forEach((button) => {
  button.addEventListener("click", () => {
    if (selectedPlayer) {
      const [type, action] = button.getAttribute("data-action").split("-");

      if (type == "score") {
        // If it's a point, it's also a correct execution
        records.push({
          index: records.length + 1,
          player: selectedPlayer.toUpperCase(),
          action: action,
          type: "correct",
        });
      }

      records.push({
        index: records.length + 1,
        player: selectedPlayer.toUpperCase(),
        action: action,
        type: type,
      });

      showAlert(
        `Registro salvo! ${records.length}. ${selectedPlayer} - ${action}`, "success");
    } else {
      showAlert("Precisa escolher um jogador com nome antes.", "danger");
    }
  });
});

document.querySelectorAll("#undo-btn").forEach((button) => {
  button.addEventListener("click", () => {
    if (records.length > 0) {
      var undone = records.pop();

      if (undone.type == "score") {
        records.pop();
      }

      console.log(undone);

      showAlert(`Registro mais recente apagado! Total de registros: ${records.length}`, "success");
    } else {
      showAlert("Precisa registrar alguma ação antes.", "danger");
    }
  });
});

document.querySelectorAll("#opponent-error-btn").forEach((button) => {
  button.addEventListener("click", () => {
    opponent_error_count += 1;
    showAlert(`Registro salvo! Erros do adversário: ${opponent_error_count}`, "success");
  });
});

document.querySelectorAll(".form-control").forEach((textbox) => {
  textbox.addEventListener("focus", () => {
    if (textbox.getAttribute("type") == "text") {
      selectedPlayer = null;

      document
        .querySelectorAll(".form-control")
        .forEach((input) => input.classList.remove("selected"));

      document
        .querySelectorAll(".player-select-btn")
        .forEach((input) => input.classList.remove("selected"));
    }
  });
});

document.getElementById("reset-btn").addEventListener("click", () => {
  records = [];
  playerSummaries = [];
  actionSummaries = [];
  opponent_error_count = 0

  selectedPlayer = null;

  document.querySelectorAll(".form-control").forEach((input) => {
    input.value = "";
    input.classList.remove("selected");
  });
  showAlert("Registros de ações e nomes dos jogadores resetados.", "warning");
});

document.getElementById("download-btn").addEventListener("click", () => {
  if (records.length == 0) {
    showAlert("Nenhuma ação foi registrada ainda.", "danger");
    return;
  }

  if (playerSummaries.length == 0) {
    showAlert("É necessário calcular as estatísticas antes.", "danger");
    return;
  }

  // Convert JSON to CSV
  const headers = Object.keys(playerSummaries[0]); // Get the headers from the first record
  const rows = playerSummaries.map((ps) =>
    headers.map((header) => ps[header]).join(",")
  ); // Convert each record to a CSV row
  var opponent_row = "Equipe Adversária,Erros,0,0," + opponent_error_count.toString();
  console.log(opponent_row);
  const csvContent = [headers.join(","), ...rows, opponent_row].join("\n"); // Combine headers and rows with line breaks
  console.log(csvContent);
  // Create a blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv" });

  // Create a download link and trigger the download
  var fn = document.getElementById("setname").value;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${fn}.csv`;
  link.click();
});

document
  .getElementById("download-summary-btn")
  .addEventListener("click", () => {
    if (records.length == 0) {
      showAlert("Nenhuma ação foi registrada ainda.", "danger");
      return;
    }

    if (actionSummaries.length == 0) {
      showAlert("É necessário calcular as estatísticas antes.", "danger");
      return;
    }

    // Convert JSON to CSV
    const headers = Object.keys(Object.values(actionSummaries[0])[0]); // Get the headers from the first record

    const rows = actionSummaries.map((ps) => {
      var pn = Object.keys(ps);
      var pv = headers.map((header) => Object.values(ps)[0][header])
      return pn.concat(pv).join(",")
    }
    ); // Convert each record to a CSV row
    const csvContent = [["Jogador"].concat(headers).join(","), ...rows].join("\n"); // Combine headers and rows with line breaks

    // Create a blob with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv" });

    // Create a download link and trigger the download
    var fn = document.getElementById("setname").value;
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${fn}-resumo.csv`;
    link.click();
  });

document.getElementById("summary-btn").addEventListener("click", () => {
  const summary = aggregateRecords();

  const summaryTableBody = document.getElementById("summary-table-body");
  summaryTableBody.innerHTML = ""; // Clear previous summary

  // Create header row dynamically
  const actions = ["Saque", "Ataque", "Bloqueio", "Recepcao", "Defesa", "Levantamento"];
  const headerRow = `
        <tr>
            <th class='tbl-th-player'>Jogador</th>
            ${actions
      .map(
        (action) =>
          `<th class="tbl-th-perc">${action == "Recepcao" ? "Recepção" : action
          }</th>`
      )
      .concat([
        "<th class='tbl-th-score'>Pontos de Saque</th>",
        "<th class='tbl-th-score'>Pontos de Ataque</th>",
        "<th class='tbl-th-score'>Pontos de Bloqueio</th>",
      ])
      .join("")}
        </tr>`;
  summaryTableBody.innerHTML = headerRow;

  playerSummaries = [];
  actionSummaries = [];

  // Create rows for each player
  Object.keys(summary).forEach((player) => {
    const row = document.createElement("tr");

    actions.map((action) => {
      const correct = summary[player][action].correct;
      const incorrect = summary[player][action].incorrect;
      const total = correct + incorrect;
      const score = summary[player][action].score;

      playerSummaries.push({
        Jogador: player,
        Ação: action == "Recepcao" ? "Recepção" : action,
        Corretas: correct,
        Pontos: score,
        Total: total,
      });
    });

    var newPlayerRow = {}
    newPlayerRow[player] = {
      Saque: "",
      Ataque: "",
      Bloqueio: "",
      Recepcao: "",
      Defesa: "",
      Levantamento: "",
      PontoSaque: "",
      PontoAtaque: "",
      PontoBloqueio: ""
    }

    actionSummaries.push(newPlayerRow);

    row.innerHTML = `
            <td class='tbl-td-player'>${player}</td>
            ${actions
        .map((action) => {
          const correct = summary[player][action].correct;
          const incorrect = summary[player][action].incorrect;
          const score = summary[player][action].score;
          const total = correct + incorrect;
          const perc = correct / total;
          const correctPercent = total ? (perc * 100).toFixed(0) : "0";
          const sty =
            perc >= 0.8
              ? "color: #088a13; font-weight: bold;"
              : perc < 0.3
                ? "color: #960909; font-weight: bold;"
                : "color: #353535; font-weight: normal;";

          actionSummaries[actionSummaries.length - 1][player][action] = `${correctPercent}% (${correct}/${total})`;

          return `<td style='${sty}'>${correctPercent}%<br>(${correct}/${total})</td>`;
        })
        .concat(
          actions.map((action) => {
            if (["Ataque", "Bloqueio", "Saque"].includes(action)) {
              const correct = summary[player][action].correct;
              const incorrect = summary[player][action].incorrect;
              const score = summary[player][action].score;
              const total = correct + incorrect;

              actionSummaries[actionSummaries.length - 1][player][`Ponto${action}`] = `${score}/${total}`;

              return `<td>${score}/${total}</td>`;
            } else {
              return "";
            }
          })
        )
        .join("")}
        `;
    summaryTableBody.appendChild(row);
  });
});

function showAlert(message, type) {
  const alertSection = document.getElementById("alert-section");
  alertSection.innerHTML = `
                    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                        ${message}
                        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>
                `;
}

function aggregateRecords() {
  const summary = {};
  console.log(records)
  // Aggregate the records
  records.forEach((record) => {
    if (!summary[record.player]) {
      summary[record.player] = {
        Saque: { correct: 0, incorrect: 0, score: 0 },
        Ataque: { correct: 0, incorrect: 0, score: 0 },
        Bloqueio: { correct: 0, incorrect: 0, score: 0 },
        Recepcao: { correct: 0, incorrect: 0, score: 0 },
        Defesa: { correct: 0, incorrect: 0, score: 0 },
        Levantamento: { correct: 0, incorrect: 0, score: 0 }
      };
    }
    summary[record.player][record.action][record.type]++;
  });

  return summary;
}
