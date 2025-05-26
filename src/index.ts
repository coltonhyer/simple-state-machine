/**
 * @packageDocumentation
 *
 * A simple finite state machine library for managing predictable state transitions.
 *
 * ## Getting Started
 *
 * ```ts
 * const machine = new StateMachine({
 *   initialState: 'idle',
 *   states: {
 *     idle: { on: { START: 'running' } },
 *     running: { on: { STOP: 'idle' } },
 *   },
 * });
 * machine.transition('START'); // => running
 * ```
 *
 * ## Core Exports
 * - {@link StateMachine}
 * - {@link Transition}
 * - {@link StateConfig}
 */

import StateMachine  from './StateMachine';

export default StateMachine;