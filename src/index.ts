import type { Writable } from "svelte/store"

/**
 * A store that allow to be flagged as invalidated
 */
export interface InvalidableStore<T> extends Writable<T> {
    /**
     * Invalidate the store value and request for fresh value
     */
    invalidate(): void
}

/**
 * Make a store "invalidable".
 * @param {Writable<*>} store The store to enhance
 * @param {function:*} updater The function to get a fresh value
 */
export function invalidable<T>(store: Writable<T>, updater: () => T):InvalidableStore<T> {
    return {
        ...store,
        invalidate: () => {
            store.set(updater())
        }
    }
}

/**
 * Make a store "invalidable", works with promise.
 *
 * When the `updater` function is call, the promise is solve before updating the store.
 * @param {Writable<*>} store The store to enhance
 * @param {function:*} updater The function to get a fresh value inside a promise
 */
export function pinvalidable<T>(store: Writable<T>, updater: () => Promise<T>):InvalidableStore<T> {
    return {
        ...store,
        invalidate: () => {
            updater().then(v => store.set(v))
        }
    }
}

/**
 * Invalidate a store.
 * @param {InvalidableStore} store The store to invalidate
 */
export function invalidate<T>(store: InvalidableStore<T>):void {
    store.invalidate()
}