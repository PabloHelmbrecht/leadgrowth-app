// Types
/**
 * Represents a handler for an event.
 * @template T - The type of the payload for the event.
 * @param {T} [payload] - The optional payload for the event.
 */
type EventHandler<T = unknown> = (payload?: T) => void

/**
 * A generic EventEmitter class for managing events and their handlers.
 * @template Events - A record of event names to their payload types.
 */
class EventEmitter<Events extends Record<string, unknown>> {
    /**
     * Stores the registered event handlers.
     * @private
     * @type {{ [K in keyof Events]?: EventHandler<Events[K]>[] }}
     */
    private events: { [K in keyof Events]?: EventHandler<Events[K]>[] } = {}

    /**
     * Registers an event handler for a specific event.
     * @template K - The key of the event in the Events record.
     * @param {K} event - The name of the event.
     * @param {EventHandler<Events[K]>} handler - The handler function for the event.
     */
    on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>) {
        if (!this.events[event]) {
            this.events[event] = []
        }
        this.events[event]!.push(handler)
    }

    /**
     * Removes an event handler for a specific event.
     * @template K - The key of the event in the Events record.
     * @param {K} event - The name of the event.
     * @param {EventHandler<Events[K]>} handler - The handler function to remove.
     */
    off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>) {
        if (!this.events[event]) return

        this.events[event] = this.events[event].filter((h) => h !== handler)
    }

    /**
     * Emits an event, calling all registered handlers for that event.
     * @template K - The key of the event in the Events record.
     * @param {K} event - The name of the event.
     * @param {Events[K]} [payload] - The optional payload to pass to the handlers.
     */
    emit<K extends keyof Events>(event: K, payload?: Events[K]) {
        if (!this.events[event]) return

        this.events[event].forEach((handler) => handler(payload))
    }
}

/**
 * A singleton instance of the EventEmitter class.
 * @type {EventEmitter<Record<string, unknown>>}
 */
export const eventEmmiter = new EventEmitter<Record<string, unknown>>()
