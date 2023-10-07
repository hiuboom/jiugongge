document.getElementById('generateButton').addEventListener('click', function () {
    fetch('http://127.0.0.1:5000/generate_sudokus1')
        .then(response => response.json())
        .then(data => {
            fetchedData = data;
            var sudokuContainer = document.getElementById('sudokuContainer');
            sudokuContainer.innerHTML = '';

            data.sudokus.forEach(function (sudokuData) {
                var sudokuHtml = '<table class="sudoku">';

                sudokuData.sudoku.forEach(function (row, i) {
                    sudokuHtml += '<tr>';
                    row.forEach(function (cell, j) {
                        sudokuHtml += '<td class="cell">' +
                            (cell !== "" ? `<span data-row="${i}" data-col="${j}">${cell}</span>` : `<input type="text" class="input-cell" data-row="${i}" data-col="${j}">`) +
                            '</td>';
                    });
                    sudokuHtml += '</tr>';
                });

                sudokuHtml += '</table>';
                sudokuContainer.innerHTML += sudokuHtml;
            });
        });
});

document.getElementById('generateButton3').addEventListener('click', function () {
    data = fetchedData;
    var sudokuContainer = document.getElementById('sudokuContainer');
    sudokuContainer.innerHTML = '';

    data.sudokus.forEach(function (sudokuData) {
        var sudokuHtml = '<table class="sudoku">';

        sudokuData.sudoku.forEach(function (row, i) {
            sudokuHtml += '<tr>';
            row.forEach(function (cell, j) {
                sudokuHtml += '<td class="cell">' +
                    (cell !== "" ? `<span data-row="${i}" data-col="${j}">${cell}</span>` : `<input type="text" class="input-cell" data-row="${i}" data-col="${j}">`) +
                    '</td>';
            });
            sudokuHtml += '</tr>';
        });

        sudokuHtml += '</table>';
        sudokuContainer.innerHTML += sudokuHtml;
    });
});

document.getElementById('solutionButton').addEventListener('click', function () {
    var sudokuContainer = document.getElementById('sudokuContainer');
    sudokuContainer.innerHTML = '';

    data = fetchedData;
    data.sudokus.forEach(function (sudokuData) {
        var sudokuHtml = '<table class="sudoku">';

        sudokuData.sudoku_value.forEach(function (row, i) {
            sudokuHtml += '<tr>';
            row.forEach(function (cell, j) {
                sudokuHtml += '<td class="cell">' +
                    (cell !== "" ? `<span data-row="${i}" data-col="${j}">${cell}</span>` : `<input type="text" class="input-cell" data-row="${i}" data-col="${j}">`) +
                    '</td>';
            });
            sudokuHtml += '</tr>';
        });

        sudokuHtml += '</table>';
        sudokuContainer.innerHTML += sudokuHtml;
    });
});

document.getElementById('validate-btn').addEventListener('click', function () {
    const sudokuData = [];
    for (let row = 0; row < 9; row++) {
        const rowData = [];
        for (let col = 0; col < 9; col++) {
            const cell = document.querySelector(`.input-cell[data-row="${row}"][data-col="${col}"]`) ||
                document.querySelector(`span[data-row="${row}"][data-col="${col}"]`)
            || document.querySelector(`.input-cell1[data-row="${row}"][data-col="${col}"]`);
            rowData.push(parseInt(cell.value) || parseInt(cell.innerText) || 0);
        }
        sudokuData.push(rowData);
    }

    fetch('http://127.0.0.1:5000/validate_sudoku', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sudoku: sudokuData })
    })
        .then(response => response.json())
        .then(data => {
            if (data.is_correct) {
                alert('正确！');
            } else {
                alert('错误！');
            }
        });
});

document.getElementById('validate-btn2').addEventListener('click', function () {
    const sudokuData1 = [];
    for (let row = 0; row < 9; row++) {
        const rowData = [];
        for (let col = 0; col < 9; col++) {
            const cell = document.querySelector(`.input-cell[data-row="${row}"][data-col="${col}"]`) ||
                document.querySelector(`span[data-row="${row}"][data-col="${col}"]`) ||
                document.querySelector(`.input-cell1[data-row="${row}"][data-col="${col}"]`);
            rowData.push(parseInt(cell.value) || parseInt(cell.innerText) || 0);
        }
        sudokuData1.push(rowData);
    }

    var sudokuContainer = document.getElementById('sudokuContainer');
    sudokuContainer.innerHTML = '';

    data = fetchedData;
    data.sudokus.forEach(function (sudokuData) {
        var sudokuHtml = '<table class="sudoku">';

        sudokuData.sudoku_value.forEach(function (row, i) {
            sudokuHtml += '<tr>';
            row.forEach(function (cell, j) {
                if (String(cell) == String(sudokuData1[i][j])) {
                    sudokuHtml += '<td class="cell">' +
                        `<span data-row="${i}" data-col="${j}">${cell}</span>` + '</td>';
                } else {
                    sudokuHtml += '<td class="cell">' +
                        `<input type="text" class="input-cell1" data-row="${i}" data-col="${j}">` + '</td>';
                }
            });
            sudokuHtml += '</tr>';
        });

        sudokuHtml += '</table>';
        sudokuContainer.innerHTML += sudokuHtml;
    });
}
);