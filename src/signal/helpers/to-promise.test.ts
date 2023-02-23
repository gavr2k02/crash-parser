import { ReplaySignal } from '../ReplaySignal';
import { Signal } from '../Signal';
import { getTestObject, TestObject } from '../tests/helpers';
import { toPromise } from './to-promise';

describe('to-promise', () => {
  it('toPromise', async () => {
    const signal: Signal<TestObject> = new Signal();
    const value = getTestObject();
    setTimeout(() => signal.emit(value), 100);
    const result = await toPromise(signal);
    expect(result).toBe(value);
  });

  it('toPromise replay', async () => {
    const signal: Signal<TestObject> = new ReplaySignal();
    const value = getTestObject();
    signal.emit(value);
    const result = await toPromise(signal);
    expect(result).toBe(value);
  });
});
