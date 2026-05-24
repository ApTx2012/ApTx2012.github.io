/* @ts-self-types="./wasm_chem.d.ts" */

/**
 * 化学计算器
 */
export class ChemCalculator {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ChemCalculatorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_chemcalculator_free(ptr, 0);
    }
    /**
     * 获取二氧化碳制备反应信息
     * @returns {string}
     */
    static co2_preparation() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.chemcalculator_co2_preparation();
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * 计算生成气体的体积 (L)，在标准状况下 1mol = 22.4L
     * @param {number} moles
     * @returns {number}
     */
    static gas_volume(moles) {
        const ret = wasm.chemcalculator_gas_volume(moles);
        return ret;
    }
    /**
     * 获取实验器材列表
     * @param {string} experiment
     * @returns {string}
     */
    static get_equipment(experiment) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(experiment, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.chemcalculator_get_equipment(ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * 获取氢气制备反应信息
     * @returns {string}
     */
    static h2_preparation() {
        let deferred1_0;
        let deferred1_1;
        try {
            const ret = wasm.chemcalculator_h2_preparation();
            deferred1_0 = ret[0];
            deferred1_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred1_0, deferred1_1, 1);
        }
    }
    /**
     * 计算摩尔质量 (g/mol)
     * @param {string} formula
     * @returns {number}
     */
    static molar_mass(formula) {
        const ptr0 = passStringToWasm0(formula, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.chemcalculator_molar_mass(ptr0, len0);
        return ret;
    }
    /**
     * 获取氧气制备反应信息
     * @param {string} method
     * @returns {string}
     */
    static o2_preparation(method) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(method, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.chemcalculator_o2_preparation(ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
    /**
     * 计算反应物质量
     * @param {number} product_mass
     * @param {number} product_molar_mass
     * @param {number} reactant_ratio
     * @returns {number}
     */
    static reactant_mass(product_mass, product_molar_mass, reactant_ratio) {
        const ret = wasm.chemcalculator_reactant_mass(product_mass, product_molar_mass, reactant_ratio);
        return ret;
    }
    /**
     * 获取实验安全提示
     * @param {string} experiment
     * @returns {string}
     */
    static safety_tips(experiment) {
        let deferred2_0;
        let deferred2_1;
        try {
            const ptr0 = passStringToWasm0(experiment, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
            const len0 = WASM_VECTOR_LEN;
            const ret = wasm.chemcalculator_safety_tips(ptr0, len0);
            deferred2_0 = ret[0];
            deferred2_1 = ret[1];
            return getStringFromWasm0(ret[0], ret[1]);
        } finally {
            wasm.__wbindgen_free(deferred2_0, deferred2_1, 1);
        }
    }
}
if (Symbol.dispose) ChemCalculator.prototype[Symbol.dispose] = ChemCalculator.prototype.free;

/**
 * 化学物质
 */
export class Compound {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CompoundFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_compound_free(ptr, 0);
    }
}
if (Symbol.dispose) Compound.prototype[Symbol.dispose] = Compound.prototype.free;

/**
 * 化学元素
 */
export class Element {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ElementFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_element_free(ptr, 0);
    }
}
if (Symbol.dispose) Element.prototype[Symbol.dispose] = Element.prototype.free;

/**
 * 模拟实验状态
 */
export class ExperimentSimulator {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ExperimentSimulatorFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_experimentsimulator_free(ptr, 0);
    }
    /**
     * 模拟过氧化氢制氧
     * @param {number} grams
     * @param {boolean} catalyst
     * @returns {number}
     */
    decompose_h2o2(grams, catalyst) {
        const ret = wasm.experimentsimulator_decompose_h2o2(this.__wbg_ptr, grams, catalyst);
        return ret;
    }
    /**
     * 模拟加热高锰酸钾制氧
     * @param {number} grams
     * @returns {number}
     */
    heat_kmno4(grams) {
        const ret = wasm.experimentsimulator_heat_kmno4(this.__wbg_ptr, grams);
        return ret;
    }
    constructor() {
        const ret = wasm.experimentsimulator_new();
        this.__wbg_ptr = ret;
        ExperimentSimulatorFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    /**
     * 模拟石灰石与酸反应制CO2
     * @param {number} caco3_grams
     * @returns {number}
     */
    produce_co2(caco3_grams) {
        const ret = wasm.experimentsimulator_produce_co2(this.__wbg_ptr, caco3_grams);
        return ret;
    }
    /**
     * 模拟锌与酸反应制氢
     * @param {number} zn_grams
     * @returns {number}
     */
    produce_h2(zn_grams) {
        const ret = wasm.experimentsimulator_produce_h2(this.__wbg_ptr, zn_grams);
        return ret;
    }
    /**
     * 重置模拟
     */
    reset() {
        wasm.experimentsimulator_reset(this.__wbg_ptr);
    }
    /**
     * 获取累计产气量
     * @returns {number}
     */
    total_gas() {
        const ret = wasm.experimentsimulator_total_gas(this.__wbg_ptr);
        return ret;
    }
}
if (Symbol.dispose) ExperimentSimulator.prototype[Symbol.dispose] = ExperimentSimulator.prototype.free;

/**
 * 化学反应
 */
export class Reaction {
    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        ReactionFinalization.unregister(this);
        return ptr;
    }
    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_reaction_free(ptr, 0);
    }
}
if (Symbol.dispose) Reaction.prototype[Symbol.dispose] = Reaction.prototype.free;
function __wbg_get_imports() {
    const import0 = {
        __proto__: null,
        __wbg___wbindgen_throw_1506f2235d1bdba0: function(arg0, arg1) {
            throw new Error(getStringFromWasm0(arg0, arg1));
        },
        __wbindgen_init_externref_table: function() {
            const table = wasm.__wbindgen_externrefs;
            const offset = table.grow(4);
            table.set(0, undefined);
            table.set(offset + 0, undefined);
            table.set(offset + 1, null);
            table.set(offset + 2, true);
            table.set(offset + 3, false);
        },
    };
    return {
        __proto__: null,
        "./wasm_chem_bg.js": import0,
    };
}

const ChemCalculatorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_chemcalculator_free(ptr, 1));
const CompoundFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_compound_free(ptr, 1));
const ElementFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_element_free(ptr, 1));
const ExperimentSimulatorFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_experimentsimulator_free(ptr, 1));
const ReactionFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_reaction_free(ptr, 1));

function getStringFromWasm0(ptr, len) {
    return decodeText(ptr >>> 0, len);
}

let cachedUint8ArrayMemory0 = null;
function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function passStringToWasm0(arg, malloc, realloc) {
    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }
    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = cachedTextEncoder.encodeInto(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
cachedTextDecoder.decode();
const MAX_SAFARI_DECODE_BYTES = 2146435072;
let numBytesDecoded = 0;
function decodeText(ptr, len) {
    numBytesDecoded += len;
    if (numBytesDecoded >= MAX_SAFARI_DECODE_BYTES) {
        cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });
        cachedTextDecoder.decode();
        numBytesDecoded = len;
    }
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

const cachedTextEncoder = new TextEncoder();

if (!('encodeInto' in cachedTextEncoder)) {
    cachedTextEncoder.encodeInto = function (arg, view) {
        const buf = cachedTextEncoder.encode(arg);
        view.set(buf);
        return {
            read: arg.length,
            written: buf.length
        };
    };
}

let WASM_VECTOR_LEN = 0;

let wasmModule, wasmInstance, wasm;
function __wbg_finalize_init(instance, module) {
    wasmInstance = instance;
    wasm = instance.exports;
    wasmModule = module;
    cachedUint8ArrayMemory0 = null;
    wasm.__wbindgen_start();
    return wasm;
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);
            } catch (e) {
                const validResponse = module.ok && expectedResponseType(module.type);

                if (validResponse && module.headers.get('Content-Type') !== 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else { throw e; }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);
    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };
        } else {
            return instance;
        }
    }

    function expectedResponseType(type) {
        switch (type) {
            case 'basic': case 'cors': case 'default': return true;
        }
        return false;
    }
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (module !== undefined) {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();
    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }
    const instance = new WebAssembly.Instance(module, imports);
    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (module_or_path !== undefined) {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (module_or_path === undefined) {
        module_or_path = new URL('wasm_chem_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync, __wbg_init as default };
