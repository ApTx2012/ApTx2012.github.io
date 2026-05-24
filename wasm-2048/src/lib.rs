use js_sys::Array;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct Game {
    board: [u32; 16],
    score: u32,
    over: bool,
}

#[wasm_bindgen]
impl Game {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Game {
        let mut game = Game {
            board: [0; 16],
            score: 0,
            over: false,
        };
        game.add_tile();
        game.add_tile();
        game
    }

    pub fn restart(&mut self) {
        self.board = [0; 16];
        self.score = 0;
        self.over = false;
        self.add_tile();
        self.add_tile();
    }

    pub fn board(&self) -> Array {
        let arr = Array::new();
        for &cell in self.board.iter() {
            arr.push(&JsValue::from(cell));
        }
        arr
    }

    pub fn score(&self) -> u32 {
        self.score
    }

    pub fn is_over(&self) -> bool {
        self.over
    }

    /// 秘技：让所有格子变成 2048
    pub fn win_game(&mut self) {
        for cell in self.board.iter_mut() {
            *cell = 2048;
        }
        self.score = 2048 * 16;
        self.over = true;
    }

    pub fn move_dir(&mut self, direction: &str) -> bool {
        if self.over {
            return false;
        }
        let moved = match direction {
            "left" => self.move_left(),
            "right" => {
                self.reverse_rows();
                let r = self.move_left();
                self.reverse_rows();
                r
            }
            "up" => {
                self.transpose();
                let r = self.move_left();
                self.transpose();
                r
            }
            "down" => {
                self.transpose();
                self.reverse_rows();
                let r = self.move_left();
                self.reverse_rows();
                self.transpose();
                r
            }
            _ => false,
        };
        if moved {
            self.add_tile();
            if !self.can_move() {
                self.over = true;
            }
        }
        moved
    }
}

// ==================== AI 自动玩功能 ====================

#[wasm_bindgen]
pub struct AI;

#[wasm_bindgen]
impl AI {
    #[wasm_bindgen(constructor)]
    pub fn new() -> AI {
        AI
    }

    /// 获取最佳移动方向
    pub fn get_best_move(&self, board: &[u32]) -> String {
        let mut best_move = "left";
        let mut best_score = f64::NEG_INFINITY;

        let directions = ["left", "right", "up", "down"];
        
        for dir in &directions {
            let mut game = Game::from_board(board);
            if game.move_dir(dir) {
                let score = self.expectimax(&game, 4, false);
                if score > best_score {
                    best_score = score;
                    best_move = dir;
                }
            }
        }
        
        best_move.to_string()
    }

    /// Expectimax 算法评估局面
    fn expectimax(&self, game: &Game, depth: i32, is_player_turn: bool) -> f64 {
        if depth == 0 || game.over {
            return self.evaluate(game);
        }

        if is_player_turn {
            // 玩家回合：选择最大值的移动
            let mut max_score = f64::NEG_INFINITY;
            let directions = ["left", "right", "up", "down"];
            
            for dir in &directions {
                let mut new_game = game.clone();
                if new_game.move_dir(dir) {
                    let score = self.expectimax(&new_game, depth - 1, false);
                    max_score = max_score.max(score);
                }
            }
            
            if max_score == f64::NEG_INFINITY {
                return self.evaluate(game);
            }
            max_score
        } else {
            // 随机回合：计算期望值（新方块出现）
            let empty_cells = game.get_empty_cells();
            if empty_cells.is_empty() {
                return self.expectimax(game, depth - 1, true);
            }
            
            let mut expected_score = 0.0;
            let prob_2 = 0.9;
            let prob_4 = 0.1;
            
            for &pos in &empty_cells {
                // 90% 概率出现 2
                let mut game_with_2 = game.clone();
                game_with_2.board[pos] = 2;
                expected_score += prob_2 * self.expectimax(&game_with_2, depth - 1, true);
                
                // 10% 概率出现 4
                let mut game_with_4 = game.clone();
                game_with_4.board[pos] = 4;
                expected_score += prob_4 * self.expectimax(&game_with_4, depth - 1, true);
            }
            
            expected_score / empty_cells.len() as f64
        }
    }

    /// 评估函数：综合考虑多种因素
    fn evaluate(&self, game: &Game) -> f64 {
        let board = &game.board;
        let mut score = 0.0;

        // 1. 空格数量（更多空格更好）
        let empty_count = board.iter().filter(|&&x| x == 0).count() as f64;
        score += empty_count * 100.0;

        // 2. 最大数字的位置（角落更好）
        let max_val = *board.iter().max().unwrap_or(&0) as f64;
        let max_pos = board.iter().position(|&x| x == max_val as u32).unwrap_or(0);
        let corner_bonus = match max_pos {
            0 | 3 | 12 | 15 => max_val * 10.0, // 角落
            _ => 0.0,
        };
        score += corner_bonus;

        // 3. 单调性（数字按顺序排列更好）
        score += self.calculate_monotonicity(board) * 50.0;

        // 4. 平滑度（相邻数字差异小更好）
        score += self.calculate_smoothness(board) * 30.0;

        // 5. 当前分数
        score += game.score as f64;

        score
    }

    /// 计算单调性
    fn calculate_monotonicity(&self, board: &[u32]) -> f64 {
        let mut score = 0.0;
        
        // 行单调性
        for r in 0..4 {
            for c in 0..3 {
                let idx = r * 4 + c;
                if board[idx] <= board[idx + 1] {
                    score += 1.0;
                }
            }
        }
        
        // 列单调性
        for c in 0..4 {
            for r in 0..3 {
                let idx = r * 4 + c;
                if board[idx] <= board[idx + 4] {
                    score += 1.0;
                }
            }
        }
        
        score
    }

    /// 计算平滑度
    fn calculate_smoothness(&self, board: &[u32]) -> f64 {
        let mut score = 0.0;
        
        for r in 0..4 {
            for c in 0..4 {
                let idx = r * 4 + c;
                let val = board[idx];
                if val == 0 { continue; }
                
                // 检查右边
                if c < 3 {
                    let right = board[idx + 1];
                    if right != 0 {
                        score -= (val as f64 - right as f64).abs().log2();
                    }
                }
                
                // 检查下边
                if r < 3 {
                    let down = board[idx + 4];
                    if down != 0 {
                        score -= (val as f64 - down as f64).abs().log2();
                    }
                }
            }
        }
        
        score
    }
}

impl Game {
    /// 从现有 board 创建游戏（用于 AI 模拟）
    fn from_board(board: &[u32]) -> Game {
        let mut new_board = [0u32; 16];
        new_board.copy_from_slice(board);
        Game {
            board: new_board,
            score: 0,
            over: false,
        }
    }

    /// 克隆游戏状态
    fn clone(&self) -> Game {
        Game {
            board: self.board,
            score: self.score,
            over: self.over,
        }
    }

    /// 获取空格位置
    fn get_empty_cells(&self) -> Vec<usize> {
        self.board
            .iter()
            .enumerate()
            .filter_map(|(i, &v)| if v == 0 { Some(i) } else { None })
            .collect()
    }

    fn add_tile(&mut self) {
        let empty: Vec<usize> = self
            .board
            .iter()
            .enumerate()
            .filter_map(|(i, &v)| if v == 0 { Some(i) } else { None })
            .collect();
        if empty.is_empty() {
            self.over = !self.can_move();
            return;
        }
        let idx = ((js_sys::Math::random() * empty.len() as f64).floor() as usize)
            .min(empty.len() - 1);
        let value = if js_sys::Math::random() < 0.9 { 2 } else { 4 };
        self.board[empty[idx]] = value;
    }

    fn can_move(&self) -> bool {
        if self.board.iter().any(|&x| x == 0) {
            return true;
        }
        for r in 0..4 {
            for c in 0..4 {
                let idx = r * 4 + c;
                if c < 3 && self.board[idx] == self.board[idx + 1] {
                    return true;
                }
                if r < 3 && self.board[idx] == self.board[idx + 4] {
                    return true;
                }
            }
        }
        false
    }

    fn transpose(&mut self) {
        for r in 0..4 {
            for c in 0..r {
                let a = r * 4 + c;
                let b = c * 4 + r;
                self.board.swap(a, b);
            }
        }
    }

    fn reverse_rows(&mut self) {
        for r in 0..4 {
            let start = r * 4;
            self.board[start..start + 4].reverse();
        }
    }

    fn move_left(&mut self) -> bool {
        let mut moved = false;
        for r in 0..4 {
            let start = r * 4;
            let mut line = [0u32; 4];
            let mut k = 0;
            for c in 0..4 {
                let val = self.board[start + c];
                if val != 0 {
                    line[k] = val;
                    k += 1;
                }
            }
            let mut merged = [0u32; 4];
            let mut pos = 0;
            let mut i = 0;
            while i < k {
                if i + 1 < k && line[i] == line[i + 1] {
                    merged[pos] = line[i] * 2;
                    self.score += merged[pos];
                    i += 2;
                } else {
                    merged[pos] = line[i];
                    i += 1;
                }
                pos += 1;
            }
            for c in 0..4 {
                if self.board[start + c] != merged[c] {
                    moved = true;
                }
                self.board[start + c] = merged[c];
            }
        }
        moved
    }
}
