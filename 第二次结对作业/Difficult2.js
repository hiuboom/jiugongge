document.getElementById('generateButton').addEventListener('click', function() {
    fetch('http://127.0.0.1:5000/generate_sudokus2')
        .then(response => response.json())
        .then(data => {
            fetchedData = data;
            var sudokuContainer = document.getElementById('sudokuContainer');
            sudokuContainer.innerHTML = '';


            data.sudokus.forEach(function(sudokuData) {
                var sudokuHtml = '<table class="sudoku">';
                
                sudokuData.sudoku.forEach(function(row, i) {
                    sudokuHtml += '<tr>';
                    row.forEach(function(cell, j) {
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

document.getElementById('generateButton3').addEventListener('click', function() {
    data = fetchedData;
    var sudokuContainer = document.getElementById('sudokuContainer');
    sudokuContainer.innerHTML = '';
    data.sudokus.forEach(function(sudokuData) {
        var sudokuHtml = '<table class="sudoku">';
        
        sudokuData.sudoku.forEach(function(row, i) {
            sudokuHtml += '<tr>';
            row.forEach(function(cell, j) {
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

document.getElementById('solutionButton').addEventListener('click', function() {
    var sudokuContainer = document.getElementById('sudokuContainer');
    sudokuContainer.innerHTML = '';
    
    data = fetchedData;
    data.sudokus.forEach(function(sudokuData) {
        var sudokuHtml = '<table class="sudoku">';
        
        sudokuData.sudoku_value.forEach(function(row, i) {
            sudokuHtml += '<tr>';
            row.forEach(function(cell, j) {
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

document.getElementById('validate-btn').addEventListener('click', function() {
    var sudokuContainer = document.getElementById('sudokuContainer');
    var tableElements = sudokuContainer.getElementsByTagName('table');

    var sudokuDataArray = [];
    for (var i = 0; i < tableElements.length; i++) {
        var tableElement = tableElements[i];
        var rows = tableElement.getElementsByTagName('tr');
        var sudoku = [];

        for (var j = 0; j < rows.length; j++) {
        var cells = rows[j].getElementsByTagName('td');
        var row = [];

        for (var k = 0; k < cells.length; k++) {
            var cellContent = cells[k].querySelector('span') || cells[k].querySelector('input');

            if (cellContent) {
            var cellValue = cellContent.innerText || cellContent.value || 0;
            row.push(cellValue);
            }
        }

        sudoku.push(row);
        }

        sudokuDataArray.push(sudoku);
    }
    fetch('http://127.0.0.1:5000/validate_sudoku1', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ sudokus: sudokuDataArray }) // 发送包含九个数独的验证数据的请求
    })
    .then(response => response.json())
    .then(data => {
        const results = data.results; // 获取每个数独的验证结果
        let message = '';

        results.forEach((result, sudokuIndex) => {
            message += `数独${sudokuIndex + 1}: ${result ? '正确！' : '错误！'}\n`;
        });

        alert(message); // 弹出包含所有验证结果的弹窗
        });
    });

document.getElementById('validate-btn2').addEventListener('click', function() {
    var sudokuContainer = document.getElementById('sudokuContainer');
    var tableElements = sudokuContainer.getElementsByTagName('table');

    var sudokuDataArray = [];
    for (var i = 0; i < tableElements.length; i++) {
        var tableElement = tableElements[i];
        var rows = tableElement.getElementsByTagName('tr');
        var sudoku = [];

        for (var j = 0; j < rows.length; j++) {
        var cells = rows[j].getElementsByTagName('td');
        var row = [];

        for (var k = 0; k < cells.length; k++) {
            var cellContent = cells[k].querySelector('span') || cells[k].querySelector('input');

            if (cellContent) {
            var cellValue = cellContent.innerText || cellContent.value || 0;
            row.push(cellValue);
            }
        }

        sudoku.push(row);
        }

        sudokuDataArray.push(sudoku);
    }
    // 上面爬取页面内代码
    // 下面生成查看错误代码

    var sudokuContainer = document.getElementById('sudokuContainer');
    sudokuContainer.innerHTML = '';
    data = fetchedData;
    data.sudokus.forEach(function(sudokuData, k) {
        var sudokuHtml = '<table class="sudoku">';
        
        sudokuData.sudoku_value.forEach(function(row, i) {
            sudokuHtml += '<tr>';
            row.forEach(function(cell, j) {
                if (String(cell) == String(sudokuDataArray[k][i][j])) {
                    sudokuHtml += '<td class="cell">' + 
                        `<span data-row="${i}" data-col="${j}">${cell}</span>` + '</td>';
                }else
                {
                    sudokuHtml += '<td class="cell">' + 
                        `<input type="text" class="input-cell1" data-row="${i}" data-col="${j}">` + '</td>';
                }
            });
            sudokuHtml += '</tr>';
        });

        sudokuHtml += '</table>';
        sudokuContainer.innerHTML += sudokuHtml;
    });
});