use js_sys::Array;
use wasm_bindgen::prelude::*;

/// 化学元素
#[wasm_bindgen]
pub struct Element {
    symbol: String,
    name: String,
    atomic_mass: f64,
}

/// 化学物质
#[wasm_bindgen]
pub struct Compound {
    name: String,
    formula: String,
    molar_mass: f64,
    state: String, // solid, liquid, gas, aqueous
}

/// 化学反应
#[wasm_bindgen]
pub struct Reaction {
    equation: String,
    reactants: Vec<String>,
    products: Vec<String>,
}

/// 化学计算器
#[wasm_bindgen]
pub struct ChemCalculator;

#[wasm_bindgen]
impl ChemCalculator {
    /// 计算摩尔质量 (g/mol)
    pub fn molar_mass(formula: &str) -> f64 {
        let atomic_masses: std::collections::HashMap<&str, f64> = [
            ("H", 1.008), ("He", 4.003), ("Li", 6.941), ("Be", 9.012),
            ("B", 10.81), ("C", 12.01), ("N", 14.01), ("O", 16.00),
            ("F", 19.00), ("Ne", 20.18), ("Na", 22.99), ("Mg", 24.31),
            ("Al", 26.98), ("Si", 28.09), ("P", 30.97), ("S", 32.07),
            ("Cl", 35.45), ("Ar", 39.95), ("K", 39.10), ("Ca", 40.08),
            ("Fe", 55.85), ("Cu", 63.55), ("Zn", 65.38), ("Mn", 54.94),
            ("Br", 79.90), ("Ag", 107.87), ("Ba", 137.33), ("Pb", 207.2),
            ("I", 126.90), ("N", 14.01), ("Si", 28.09),
        ].iter().cloned().collect();

        let mut mass = 0.0;
        let mut i = 0;
        let chars: Vec<char> = formula.chars().collect();

        while i < chars.len() {
            if chars[i].is_uppercase() {
                let mut symbol = chars[i].to_string();
                i += 1;
                if i < chars.len() && chars[i].is_lowercase() {
                    symbol.push(chars[i]);
                    i += 1;
                }
                let mut num_str = String::new();
                while i < chars.len() && chars[i].is_ascii_digit() {
                    num_str.push(chars[i]);
                    i += 1;
                }
                let count: f64 = if num_str.is_empty() {
                    1.0
                } else {
                    num_str.parse().unwrap_or(1.0)
                };

                if let Some(&mass_per_atom) = atomic_masses.get(symbol.as_str()) {
                    mass += mass_per_atom * count;
                }
            } else {
                i += 1;
            }
        }
        mass
    }

    /// 计算生成气体的体积 (L)，在标准状况下 1mol = 22.4L
    pub fn gas_volume(moles: f64) -> f64 {
        moles * 22.4
    }

    /// 计算反应物质量
    pub fn reactant_mass(product_mass: f64, product_molar_mass: f64, reactant_ratio: f64) -> f64 {
        (product_mass / product_molar_mass) * reactant_ratio
    }

    /// 获取氧气制备反应信息
    pub fn o2_preparation(method: &str) -> String {
        match method {
            "kmno4" => "高锰酸钾加热分解:
2KMnO₄ → K₂MnO₄ + MnO₂ + O₂↑
需加热到 200°C 以上".to_string(),
            "h2o2" => "过氧化氢催化分解:
2H₂O₂ → 2H₂O + O₂↑
常温反应，加二氧化锰催化".to_string(),
            "kclo3" => "氯酸钾加热分解:
2KClO₃ → 2KCl + 3O₂↑
需加热并加二氧化锰催化".to_string(),
            _ => "未知方法".to_string(),
        }
    }

    /// 获取氢气制备反应信息
    pub fn h2_preparation() -> String {
        "锌粒与稀硫酸反应:
Zn + H₂SO₄ → ZnSO₄ + H₂↑
常温下进行，需验纯".to_string()
    }

    /// 获取二氧化碳制备反应信息
    pub fn co2_preparation() -> String {
        "石灰石与稀盐酸反应:
CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂↑
常温下进行".to_string()
    }

    /// 获取实验安全提示
    pub fn safety_tips(experiment: &str) -> String {
        match experiment {
            "o2" => "1. 高锰酸钾加热时试管口向下倾斜
2. 先撤导管再移酒精灯（防止水倒吸）
3. 收集时导管要深入集气瓶底部
4. 用带火星的木条验满".to_string(),
            "h2" => "1. 点燃前必须验纯
2. 检验纯度后方可进行实验
3. 整个实验都要远离明火".to_string(),
            "co2" => "1. 制取时用向上排空气法
2. 燃着的蜡烛由下而上放入
3. 澄清石灰水变浑浊说明有CO₂".to_string(),
            "naoh" => "1. 氢氧化钠有强腐蚀性
2. 称量时放在烧杯中（不能直接放纸上）
3. 溶解时放热，注意安全".to_string(),
            _ => "注意安全，规范操作".to_string(),
        }
    }

    /// 获取实验器材列表
    pub fn get_equipment(experiment: &str) -> String {
        match experiment {
            "o2_kmno4" => "酒精灯|试管|铁架台|导管|水槽|集气瓶|带火星木条|棉花".to_string(),
            "o2_h2o2" => "锥形瓶|分液漏斗|导管|水槽|集气瓶|带火星木条|二氧化锰".to_string(),
            "h2" => "试管|铁架台|酒精灯|导管|水槽|集气瓶|锌粒|稀硫酸|验纯用小试管".to_string(),
            "co2" => "锥形瓶|长颈漏斗|导管|集气瓶|石灰石|稀盐酸|燃着的蜡烛|澄清石灰水".to_string(),
            "fe_cuso4" => "试管|铁钉|硫酸铜溶液|夹子|水杯".to_string(),
            "naoh_hcl" => "烧杯|玻璃棒|滴管|pH试纸|氢氧化钠溶液|稀盐酸".to_string(),
            _ => "烧杯|试管|导管|酒精灯".to_string(),
        }
    }
}

/// 模拟实验状态
#[wasm_bindgen]
pub struct ExperimentSimulator {
    o2_produced: f64,
    h2_produced: f64,
    co2_produced: f64,
    current_step: u32,
}

#[wasm_bindgen]
impl ExperimentSimulator {
    #[wasm_bindgen(constructor)]
    pub fn new() -> ExperimentSimulator {
        ExperimentSimulator {
            o2_produced: 0.0,
            h2_produced: 0.0,
            co2_produced: 0.0,
            current_step: 0,
        }
    }

    /// 模拟加热高锰酸钾制氧
    pub fn heat_kmno4(&mut self, grams: f64) -> f64 {
        // 2KMnO₄ → K₂MnO₄ + MnO₂ + O₂
        // 2 * 158 = 316g Kmno4 生成 1mol O2 = 22.4L
        let kmno4_molar_mass = 158.0;
        let o2_molar_mass = 32.0;
        let ratio = o2_molar_mass / (2.0 * kmno4_molar_mass);
        let o2_mass = grams * ratio;
        self.o2_produced += o2_mass;
        o2_mass
    }

    /// 模拟过氧化氢制氧
    pub fn decompose_h2o2(&mut self, grams: f64, catalyst: bool) -> f64 {
        // 2H₂O₂ → 2H₂O + O₂
        let h2o2_molar_mass = 34.0;
        let o2_molar_mass = 32.0;
        let ratio = o2_molar_mass / (2.0 * h2o2_molar_mass);
        let o2_mass = grams * ratio * if catalyst { 1.0 } else { 0.3 };
        self.o2_produced += o2_mass;
        o2_mass
    }

    /// 模拟锌与酸反应制氢
    pub fn produce_h2(&mut self, zn_grams: f64) -> f64 {
        // Zn + H₂SO₄ → ZnSO₄ + H₂
        let zn_molar_mass = 65.0;
        let h2_molar_mass = 2.0;
        let ratio = h2_molar_mass / zn_molar_mass;
        let h2_mass = zn_grams * ratio;
        self.h2_produced += h2_mass;
        h2_mass
    }

    /// 模拟石灰石与酸反应制CO2
    pub fn produce_co2(&mut self, caco3_grams: f64) -> f64 {
        // CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂
        let caco3_molar_mass = 100.0;
        let co2_molar_mass = 44.0;
        let ratio = co2_molar_mass / caco3_molar_mass;
        let co2_mass = caco3_grams * ratio;
        self.co2_produced += co2_mass;
        co2_mass
    }

    /// 获取累计产气量
    pub fn total_gas(&self) -> f64 {
        self.o2_produced + self.h2_produced + self.co2_produced
    }

    /// 重置模拟
    pub fn reset(&mut self) {
        self.o2_produced = 0.0;
        self.h2_produced = 0.0;
        self.co2_produced = 0.0;
        self.current_step = 0;
    }
}