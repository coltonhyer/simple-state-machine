/**
 * The configuration details for a transition
 * 
 * @example
 * ```ts
 * {
 *  target: "B",
 *  action: "output"
 * }
 * ```
 */
interface TransitionConfig {
    /**
     * The state to transition into
     */
    target?: string,
    /**
     * The action to perform as a side effect of this transition
     */
    action?: string
}

/**
 * A function to trigger on a given transition
 * 
 * @comment This function takes no parameters. This will be improved upon in a future update.
 * 
 * @remarks This function intentionally doesn't return anything. This is because this is a side effect of a transition, not a real function.
 * 
 */
type ActionFunction = () => void;

/**
 * The configuration details for a state node
 * 
 * @example
 * ``` ts
 * {
 *  on: {
 *      forward: {
 *          target: 'C',
 *          action: 'output'
 *      },
 *      back: {
 *          target: 'A'
 *      }
 *  }
 * }
 * ```
 */
export interface StateConfig {
    /**
     * Event handlers that map specific events to transitions
     */
    on: Record<string, TransitionConfig>;
    /**
     * A dictionary of actions to reference in the {@link TransitionConfig}
     */
    actions?: Record<string, ActionFunction>;
}

/**
 * The configuration details for a state machine
 * @example 
 * ```ts
 * {
 *  initial: 'B',
 *  states: {
 *      A: {...},
 *      B: {...},
 *      C: {...}
 *  }
 *  on: {
 *      finish: {
 *          target: 'C',
 *          action: 'output'
 *      }
 *  },
 *  actions: {
 *      output: () => console.log('output');
 *  }
 * }
 * ```
 */
export interface MachineConfig<States extends Record<string, StateConfig>> extends StateConfig {
    /**
     * The starting state for the machine when started
     */
    initial: keyof States & string,
    /**
     * The states for the machine to manage
     */
    states: States;
}