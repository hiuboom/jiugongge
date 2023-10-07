from flask import Flask, jsonify
from copy import deepcopy
import random
from concurrent.futures import ThreadPoolExecutor
from flask_cors import CORS
from flask import request

app = Flask(__name__, static_folder='static', static_url_path='/static')
CORS(app)

def generate_full_sudoku():
    base = 3
    side = base*base

    # 定义一个生成数独模板的函数
    def pattern(r,c): 
        return (base*(r%base)+r//base+c)%side

    # 随机排列行、列和数字
    from random import sample
    def shuffle(s): 
        return sample(s,len(s)) 
    rBase = range(base) 
    rows  = [ g*base + r for g in shuffle(rBase) for r in shuffle(rBase) ] 
    cols  = [ g*base + c for g in shuffle(rBase) for c in shuffle(rBase) ]
    nums  = shuffle(range(1,base*base+1))

    # 生成数独棋盘
    board = [ [nums[pattern(r,c)] for c in cols] for r in rows ]

    return board

def remove_numbers(board, num_to_remove):
    # 创建一个深拷贝，以免修改原始数独
    puzzle = deepcopy(board)
    side = len(puzzle)
    for _ in range(num_to_remove):
        while True:
            i, j = random.randint(0, side - 1), random.randint(0, side - 1)
            if puzzle[i][j] != "":
                # 临时保存挖去的数字
                removed_number = puzzle[i][j]
                # 挖去数字
                puzzle[i][j] = ""
                # 检查是否有多解或者无解
                if not has_unique_solution(puzzle):
                    # 如果导致多解或者无解，恢复原来的数字
                    puzzle[i][j] = removed_number
                else:
                    break
    return puzzle

# 检查数独是否正确
def is_sudoku_valid(board):
    def is_valid_row(row):
        seen = set()
        for cell in row:
            cell_str = str(cell)
            if not cell_str.isdigit() or cell_str > '9' or cell_str < '1':
                return False  # 如果包含非数字字符和'.'，返回False
            if cell_str in seen:
                return False  # 如果数字字符重复，返回False
            seen.add(cell_str)
        return True

    def is_valid_column(col):
        seen = set()
        for cell in col:
            cell_str = str(cell)
            if not cell_str.isdigit() or cell_str > '9' or cell_str < '1':
                return False  # 如果包含非数字字符和'.'，返回False
            if cell_str in seen:
                return False  # 如果数字字符重复，返回False
            seen.add(cell_str)
        return True

    def is_valid_box(box):
        seen = set()
        for row in box:
            for cell in row:
                cell_str = str(cell)
                if not cell_str.isdigit():
                    return False  # 如果包含非数字字符和'.'，返回False
                if cell_str in seen:
                    return False  # 如果数字字符重复，返回False
                seen.add(cell_str)
        return True

    # 检查每一行
    for row in board:
        if not is_valid_row(row):
            return False

    # 检查每一列
    for col in zip(*board):
        if not is_valid_column(col):
            return False

    # 检查每个3x3小九宫格
    for i in range(0, 9, 3):
        for j in range(0, 9, 3):
            box = [row[j:j+3] for row in board[i:i+3]]
            if not is_valid_box(box):
                return False

    return True

#  确保挖去数字后的数独按照人的逻辑有且只有唯一解
def has_unique_solution(sudoku):
    def solve(board):
        for i in range(9):
            for j in range(9):
                if board[i][j] == 0:
                    for num in range(1, 10):
                        if is_valid(board, i, j, num):
                            board[i][j] = num
                            if solve(board):
                                return True
                            board[i][j] = 0
                    return False
        return True
    def is_valid(board, row, col, num):
        for i in range(9):
            if board[row][i] == num or board[i][col] == num:
                return False
            if board[3 * (row // 3) + i // 3][3 * (col // 3) + i % 3] == num:
                return False
        return True

    board = deepcopy(sudoku)
    return solve(board)

def generate_and_save_sudoku(index):
    full_sudoku = generate_full_sudoku()
    puzzle = remove_numbers(full_sudoku, num_to_remove=10)
    return {'index': index, 'sudoku': puzzle, 'sudoku_value': full_sudoku}

@app.route('/generate_sudokus1')
def generate_sudokus1():
    with ThreadPoolExecutor(max_workers=9) as executor:
        sudoku_data = executor.map(generate_and_save_sudoku, range(1))

    sudoku_paths = []
    for data in sudoku_data:
        sudoku_paths.append(data)
    # print(sudoku_paths)
    return jsonify({'sudokus': sudoku_paths})

@app.route('/generate_sudokus2')
def generate_sudokus2():
    with ThreadPoolExecutor(max_workers=9) as executor:
        sudoku_data = executor.map(generate_and_save_sudoku, range(9))

    sudoku_paths = []
    for data in sudoku_data:
        sudoku_paths.append(data)

    return jsonify({'sudokus': sudoku_paths})

@app.route('/validate_sudoku', methods=['POST'])
def validate_sudoku():
    data = request.get_json()
    sudoku = data['sudoku']
    is_correct = is_sudoku_valid(sudoku)
    return jsonify({'is_correct': is_correct})

@app.route('/validate_sudoku1', methods=['POST'])
def validate_sudoku1():
    data = request.get_json()
    sudokus = data['sudokus']
    results = []
    
    for sudoku in sudokus:
        is_correct = is_sudoku_valid(sudoku)
        results.append(is_correct)
    
    return jsonify({'results': results})


if __name__ == '__main__':
    app.run(debug=True)