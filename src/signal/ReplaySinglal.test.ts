import { delay } from '../utils/delay';
import { ReplaySignal } from './ReplaySignal';
import { getTestObject, TestObject } from './tests/helpers';

describe('ReplaySignal', () => {
  it('replays', async () => {
    const signal: ReplaySignal<TestObject> = new ReplaySignal();
    const value = getTestObject();
    signal.emit(value);
    const callback = jest.fn();
    signal.subscribe(callback);
    await delay(1);
    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(value);
    expect(signal.value).toBe(value);
  });
});
