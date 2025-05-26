import CoreState from "./CoreState";
import { StateConfig } from './structs/BaseConfig';

export default class State extends CoreState {
    constructor(config: StateConfig){
        super(config.on ?? {}, config.actions ?? {});
    }
    can(event: string){
        return this.transitions.hasOwnProperty(event);
    }
    handleEvent(event: string){
        return this.transitions[event];
    }
}