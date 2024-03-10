/**
 * A basic state object that holds core functionality for state classes
 */
export default abstract class CoreState{
    /**
     * The map of transitions to activate based on the event received
     */
    transitions: any;
    /**
     * The side effects available for the transitions map to use
     */
    actions: any;

    constructor(handlers: any, actions: any){
        this.transitions = { ...handlers };
        this.actions = { ...actions };
    }

    /**
     * Handles the transition logic of this state object given an event key
     * 
     * @param action - The key to the {@link actions} object
     */
    protected doAction(action: string){
        const fn = this.actions[action];
        if (!fn){
            throw new Error(`Invalid action reference, unable to read ${action}`)
        }
        fn();
    };

    /**
     * Verifies if the {@link currentState} has a transition for the corresponding event
     * 
     * @param event - The key to the {@link transition} object
     * 
     * @returns `true` if the event has a corresponding transition. `false` otherwise.
     */
    abstract can(event: string): boolean
}