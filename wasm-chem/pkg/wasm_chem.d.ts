/* tslint:disable */
/* eslint-disable */

/**
 * 化学计算器
 */
export class ChemCalculator {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
    /**
     * 获取二氧化碳制备反应信息
     */
    static co2_preparation(): string;
    /**
     * 计算生成气体的体积 (L)，在标准状况下 1mol = 22.4L
     */
    static gas_volume(moles: number): number;
    /**
     * 获取实验器材列表
     */
    static get_equipment(experiment: string): string;
    /**
     * 获取氢气制备反应信息
     */
    static h2_preparation(): string;
    /**
     * 计算摩尔质量 (g/mol)
     */
    static molar_mass(formula: string): number;
    /**
     * 获取氧气制备反应信息
     */
    static o2_preparation(method: string): string;
    /**
     * 计算反应物质量
     */
    static reactant_mass(product_mass: number, product_molar_mass: number, reactant_ratio: number): number;
    /**
     * 获取实验安全提示
     */
    static safety_tips(experiment: string): string;
}

/**
 * 化学物质
 */
export class Compound {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
}

/**
 * 化学元素
 */
export class Element {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
}

/**
 * 模拟实验状态
 */
export class ExperimentSimulator {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * 模拟过氧化氢制氧
     */
    decompose_h2o2(grams: number, catalyst: boolean): number;
    /**
     * 模拟加热高锰酸钾制氧
     */
    heat_kmno4(grams: number): number;
    constructor();
    /**
     * 模拟石灰石与酸反应制CO2
     */
    produce_co2(caco3_grams: number): number;
    /**
     * 模拟锌与酸反应制氢
     */
    produce_h2(zn_grams: number): number;
    /**
     * 重置模拟
     */
    reset(): void;
    /**
     * 获取累计产气量
     */
    total_gas(): number;
}

/**
 * 化学反应
 */
export class Reaction {
    private constructor();
    free(): void;
    [Symbol.dispose](): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_element_free: (a: number, b: number) => void;
    readonly __wbg_compound_free: (a: number, b: number) => void;
    readonly __wbg_reaction_free: (a: number, b: number) => void;
    readonly __wbg_chemcalculator_free: (a: number, b: number) => void;
    readonly chemcalculator_molar_mass: (a: number, b: number) => number;
    readonly chemcalculator_gas_volume: (a: number) => number;
    readonly chemcalculator_reactant_mass: (a: number, b: number, c: number) => number;
    readonly chemcalculator_o2_preparation: (a: number, b: number) => [number, number];
    readonly chemcalculator_h2_preparation: () => [number, number];
    readonly chemcalculator_co2_preparation: () => [number, number];
    readonly chemcalculator_safety_tips: (a: number, b: number) => [number, number];
    readonly chemcalculator_get_equipment: (a: number, b: number) => [number, number];
    readonly __wbg_experimentsimulator_free: (a: number, b: number) => void;
    readonly experimentsimulator_new: () => number;
    readonly experimentsimulator_heat_kmno4: (a: number, b: number) => number;
    readonly experimentsimulator_decompose_h2o2: (a: number, b: number, c: number) => number;
    readonly experimentsimulator_produce_h2: (a: number, b: number) => number;
    readonly experimentsimulator_produce_co2: (a: number, b: number) => number;
    readonly experimentsimulator_total_gas: (a: number) => number;
    readonly experimentsimulator_reset: (a: number) => void;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
    readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;

/**
 * Instantiates the given `module`, which can either be bytes or
 * a precompiled `WebAssembly.Module`.
 *
 * @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
 *
 * @returns {InitOutput}
 */
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
 * If `module_or_path` is {RequestInfo} or {URL}, makes a request and
 * for everything else, calls `WebAssembly.instantiate` directly.
 *
 * @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
 *
 * @returns {Promise<InitOutput>}
 */
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
