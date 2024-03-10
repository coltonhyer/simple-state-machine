import CoreState from './CoreState';
import State  from './State';

import { MachineConfig } from './structs/BaseConfig';

/**
 * A state object that manages a graph of state objects.
 */
export default class StateMachine extends CoreState {
    /**
     * The child states that the machine manages
     */
    private states: Record<string, State> = {};

    /**
     * The current state of the machine. Value changes through {@link Transition | Transitions}
     */
    get currentState(): string{
        return this.currentState;
    }

    /**
     * Current state should only be able to be set from within
     * 
     * @param state - The state key to transition to
     */
    private set currentState(state: string) {
        this.currentState = state;
    }

    private get currentStateNode(): State {
        return this.states[this.currentState];
    }

    constructor(config: MachineConfig) {
        super(config.on, config.actions);
        for(let key in config.states) {
            const state = new State(config.states[key]);
            this.states[key] = state;
        }
        this.currentState = config.initial;
    }

    private transition(fromState: string, toState: string = this.currentState, action: string = ''){
        this.currentState = toState;
        if (action){
            // if state has action, state.doAction()
            
            // else if I have action, me.doAction()
        }
    }

    tap(event: string){
        if (!this.can(event)){
            throw new Error(`Unable to perform transition for given event string: ${event}. No reachable event handlers detected.`)
        }
        this.handleEvent(event);
    }

    private handleEvent(event: string){
        let transition = this.currentStateNode.handleEvent(event);
        if (transition){
            this.transition(this.currentState, transition.target, transition.action);
        }
        else {
            transition = this.transitions[event];
            this.transition(this.currentState, transition.targete, transition.action);
        }
    }

    can(event: string){
        return this.currentStateNode.can(event) || this.transitions.hasOwnProperty(event);
    }
}