/* tslint:disable */
/* eslint-disable */

export class AI {
    free(): void;
    [Symbol.dispose](): void;
    /**
     * 获取最佳移动方向
     */
    get_best_move(board: Uint32Array): string;
    constructor();
}

export class Game {
    free(): void;
    [Symbol.dispose](): void;
    board(): Array<any>;
    is_over(): boolean;
    move_dir(direction: string): boolean;
    constructor();
    restart(): void;
    score(): number;
    /**
     * 秘技：让所有格子变成 2048
     */
    win_game(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
    readonly memory: WebAssembly.Memory;
    readonly __wbg_ai_free: (a: number, b: number) => void;
    readonly __wbg_game_free: (a: number, b: number) => void;
<<<<<<< HEAD
=======
    readonly ai_get_best_move: (a: number, b: number, c: number) => [number, number];
    readonly ai_new: () => number;
>>>>>>> 4b734cdc321df46e6b863128fc14ce2026a98d3d
    readonly game_board: (a: number) => any;
    readonly game_is_over: (a: number) => number;
    readonly game_move_dir: (a: number, b: number, c: number) => number;
    readonly game_new: () => number;
    readonly game_restart: (a: number) => void;
    readonly game_score: (a: number) => number;
    readonly game_win_game: (a: number) => void;
    readonly __wbindgen_externrefs: WebAssembly.Table;
    readonly __wbindgen_malloc: (a: number, b: number) => number;
    readonly __wbindgen_free: (a: number, b: number, c: number) => void;
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
