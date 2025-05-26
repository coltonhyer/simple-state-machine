import CoreState from './CoreState';
import State  from './State';

import { StateConfig, MachineConfig } from './structs/BaseConfig';

/**
 * A state object that manages a graph of state objects.
 */
export default class StateMachine<States extends Record<string, StateConfig>> extends CoreState {
    /**
     * The child states that the machine manages
     */
    private states: Record<string, State> = {};

    /**
     * The string representation of the current state within the machine
     */
    private currentState: string;

    /**
     * The current state of the machine. Value changes through {@link transition }
     */
    get state(): string{
        return this.currentState
    }

    /**
     * Gets the node represented by the current state key
     */
    private get currentStateNode(): State {
        return this.states[this.currentState];
    }

    /**
     * Initializes states for a machine
     * @param statesConfig The extracted configuration of states passed to the machine config
     */
    private initStates(statesConfig: States){
        const keys = Object.keys(statesConfig)
        for(let key of keys){
            const stateConfig = statesConfig[key];
            for (const [event, transition] of Object.entries(stateConfig.on)){
                const target = transition.target;
                if (target && !keys.includes(target)){
                    throw new Error(`ERROR: unable to construct state machine! Unreachable path in state ${key}! Invalid state target ${target} defined in ${event}`)
                }
            }

            const state = new State(stateConfig);
            this.states[key] = state;
        }
    }

    constructor(config: MachineConfig<States>) {
        super(config.on, config.actions);
        this.currentState = config.initial
        try{
            this.initStates(config.states);
        }
        catch (err){
            console.error(err)
        }
    }

    /**
     * The core transition method for a machine handles any actions and state transitions
     * @param toState - The target state
     * @param action - The action to perform
     */
    private transition(toState: string = this.currentState, action: string = ''){
        if (action){
            try{
                this.currentStateNode.doAction(action)
            }
            catch {
                // eat the first error, let the state machine return the error if there is no available action
                try  {
                    this.doAction(action)
                }
                catch(err){
                    console.error(err)
                }
            }
        }
        this.currentState = toState;
    }

    /**
     * Invoke a transition event
     * @param event
     */
    tap(event: string){
        if (!this.can(event)){
            throw new Error(`Unable to perform transition for given event string: ${event}. No reachable event handlers detected.`)
        }
        this.handleEvent(event);
    }

    /**
     * The internal event handling of a state machine
     * @param event
     */
    private handleEvent(event: string){
        let transition = this.currentStateNode.handleEvent(event);
        if (transition){
            this.transition(transition.target, transition.action);
        }
        else {
            transition = this.transitions[event];
            this.transition(transition.target, transition.action);
        }
    }

    can(event: string){
        return this.currentStateNode.can(event) || this.transitions.hasOwnProperty(event);
    }
}