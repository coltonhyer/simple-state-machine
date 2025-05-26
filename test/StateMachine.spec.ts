import StateMachine from '../src'

describe('State Machine', () => {
    let config: any;
    let foo: jest.Mock;
    let bar: jest.Mock;

    beforeEach(() => {
        foo = jest.fn();
        bar = jest.fn();

        config = {
            initial: 'A',
            on: { RESET: { target: 'A', action: 'bar' } },
            actions: { foo, bar },
            states: {
                A: { on: { GO: { target: 'B', action: 'foo' }, LOG: { action: 'foo' } } },
                B: { on: { BACK: { target: 'A', action: 'bar' } } },
                C: { on: {}}
            }
        }
    })

    it('starts in the initial state', () => {
        const machine = new StateMachine(config)
        
        expect(machine.state).toBe('A')
        expect(machine.can('GO')).toBe(true)
        expect(machine.can('BACK')).toBe(false)
    })

    it('Transitions from A -> B, invokes "foo" action', () =>{
        const machine = new StateMachine(config)

        machine.tap('GO')

        expect(foo).toHaveBeenCalledTimes(1);
        expect(machine.state).toBe('B')
        expect(machine.can('BACK')).toBe(true);
    })

    it('Throws an error when tapping an unknown event', () =>{
        const machine = new StateMachine(config)

        expect(() => machine.tap('INVALID')).toThrow()
    })

    it('Supports global transitions', () =>{
        const machine = new StateMachine(config)

        machine.tap('GO')
        expect(machine.state).toBe('B')

        machine.tap('RESET')
        expect(bar).toHaveBeenCalledTimes(1)
        expect(machine.state).toBe('A')
    })

    it('Allows internal transitions (transitions with no target, action only)', () =>{
        const machine = new StateMachine(config)
        machine.tap('LOG')

        expect(foo).toHaveBeenCalledTimes(1)
        expect(machine.state).toBe('A')
    })
})