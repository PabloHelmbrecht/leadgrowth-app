//Types
type EventHandler<T = unknown> = (payload?: T) => void

class EventEmitter<Events extends Record<string, unknown>> {
    private events: { [K in keyof Events]?: EventHandler<Events[K]>[] } = {}

    on<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>) {
        if (!this.events[event]) {
            this.events[event] = []
        }
        this.events[event]!.push(handler)
    }

    off<K extends keyof Events>(event: K, handler: EventHandler<Events[K]>) {
        if (!this.events[event]) return

        this.events[event] = this.events[event].filter((h) => h !== handler)
    }

    emit<K extends keyof Events>(event: K, payload?: Events[K]) {
        if (!this.events[event]) return

        this.events[event].forEach((handler) => handler(payload))
    }
}

export const eventEmmiter = new EventEmitter()
