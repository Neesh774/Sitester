# Electron Architecture

Goals:
- state should be immutable and data-only.
- app should be the container for the state/dispatch loop.
- plugins should implement and manage the side-effects.


Demonstrated a basic state machine architecture with all side-effects implemented as plugins.

```ts
class App<State, Action> {
	state: State
	dispatch(action: Action): void

	constructor(
		initialState: State,
		reducer: (state: State, action: Action) => State,
		plugins: Plugin<State,Action>[]
	)
}

type Plugin<State, Action> = (app: App<State, Action>) => Effect<State>

type Effect<State> = {
	update(prevState: State): void
	destroy(): void
}
```

This example shows how to manipulate a set of Electron windows using this pattern.