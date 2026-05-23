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

impl Game {
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
