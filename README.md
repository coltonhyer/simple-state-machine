A simple finite state machine library for managing predictable state transitions.

## Usage

### Initialize

```ts
const machine = new StateMachine({
    initial: 'idle',
    states: {
        idle: { on: { START: { target: 'running' } } },
        running: { on: { STOP: { target: 'idle' } } }
    }
})
```

**Invalid targets**

If you try to move a state into an undefined state, the machine initialization will thow an error

```ts
const machine = new StateMachine({
    initial: 'idle',
    states: {
        idle: { on: { START: { target: 'stuck' } } },
        running: { on: { STOP: { target: 'idle' } } }
    }
})
// "Error: unable to construct state machine! Unreachable path in state 'idle'! Invalid state target 'stuck' defined in 'START'"
```

### Transitioning

**State Transitions**

State transitions are the building block of the machine, they define where to go when an event is invoked
```ts
machine.state
// "idle"
machine.tap('START')
machine.state
// "running"
```

**Invalid Transitions**

You cannot invoke an unreachable or undefined transition
```ts
machine.tap('STOP')
// "Error: Unable to perform transition for given event string: 'STOP'. No reachable event handlers detected."

machine.tap('RANDOM')
// "Error: Unable to perform transition for given event string: 'RANDOM'. No reachable event handlers detected."
```

**Machine/Root Transitions**

You can also define root level transitions that are available on any state

```ts
const machine = new StateMachine({
    initial: 'idle',
    on: { RESET: { target: 'idle' } }
    states: {
        idle: { on: { START: { target: 'running' } } },
        running: { on: { STOP: { target: 'idle' } } }
    }
})
```

```ts
machine.state
// "idle"
machine.tap('RESET')
machine.state
// "idle"

machine.tap('START')
machine.state
// "running"

machine.tap('RESET')
machine.state
// "idle"

```
**Transition Collisions**

If an invoked transition is defined on both the state and machine level, the state level will win

```ts
const machine = new StateMachine({
    initial: 'idle',
    on: { RESTART: { target: 'idle' } }
    states: {
        idle: { on: { START: { target: 'running' } } },
        running: { on: { STOP: { target: 'idle' }, PAUSE: { target: 'stuck' } } },
        stuck: { on: { RESTART: { target: 'running' } } }
    }
})
```

```ts
machine.tap('START')
machine.tap('PAUSE')
machine.state
// "stuck"

machine.tap('RESTART')
machine.state
// "running"

machine.tap('RESTART')
machine.state
// "idle"
```


### Actions

**State Actions**

```ts
const machine = new StateMachine({
    initial: 'idle',
    states: {
        idle: { actions: { signal: () => console.log("Starting machine") }, on: { START: { target: 'running', action: 'signal' } } },
        running: { on: { STOP: { target: 'idle' } } }
    }
})
```

```ts
machine.tap('START')
// "Starting machine"
```

**Invalid Actions**

If you reference an action in your config that cannot be invoked during a transition, the machine will throw an error at machine runtime

```ts
const machine = new StateMachine({
    initial: 'idle',
    states: {
        idle: { actions: { signal: () => console.log("Starting machine") }, on: { START: { target: 'running', action: 'random' } } },
        running: { on: { STOP: { target: 'idle' } } }
    }
})
```

```ts
machine.tap('START')
// "ERROR: Invalid action reference, unable to read 'random'"
```

**Machine/Root Actions**

```ts
const machine = new StateMachine({
    initial: 'idle',
    actions: {
        signal: () => console.log("Invoking transition")
    }
    states: {
        idle: { on: { START: { target: 'running', action: 'signal' } } },
        running: { on: { STOP: { target: 'idle', action: 'signal' } } }
    }
})
```
```ts
machine.tap('START')
// "Invoking transition"

machine.tap('STOP')
// "Invoking transition"
```

**Action overlap**

If there is any overlap in action definitions, an overwrite will take effect, swallowing the root-level action

```ts
const machine = new StateMachine({
    initial: 'idle',
    actions: {
        signal: () => console.log("Invoking transition")
    }
    states: {
        idle: { actions: { signal: () => console.log("Starting machine") }, on: { START: { target: 'running', action: 'signal' } } },
        running: { on: { STOP: { target: 'idle', action: 'signal' } } }
    }
})
```

```ts
machine.tap('START')
// "Starting machine"

machine.tap('STOP')
// "Invoking transition"
```

### Lookahead

If you want to put some guards in place before invoking a transition, you can look ahead to see if a desired transition is reachable from your current state

``` ts
machine.can('START')
// true

machine.can('STOP')
// false

machine.can('RANDOM')
// false
```

## Core Exports

- {@link StateMachine}