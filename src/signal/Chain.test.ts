import { times } from 'lodash';
import { filter } from './helpers/filter';
import { map } from './helpers/map';
import { once } from './helpers/once';
import { ReplaySignal } from './ReplaySignal';
import { Signal } from './Signal';
import { getTestObject, TestObject } from './tests/helpers';

describe('Chain', () => {
  it('once', () => {
    const signal: Signal<TestObject> = new Signal();
    const callback = jest.fn();
    signal.subscribe(callback);
    const callbackOnce = jest.fn();
    signal.chain(once()).subscribe(callbackOnce);
    const value = getTestObject();
    times(10, () => signal.emit(value));
    expect(callbackOnce).toBeCalledTimes(1);
    expect(callbackOnce).toHaveBeenCalledWith(value);
    expect(callback).toBeCalledTimes(10);
  });

  it('filter', () => {
    const signal: Signal<number> = new Signal();
    const callback = jest.fn();
    signal.subscribe(callback);
    const callbackFilter = jest.fn();
    signal.chain(filter((value) => value >= 5)).subscribe(callbackFilter);
    times(10, (index) => signal.emit(index));
    expect(callbackFilter).toBeCalledTimes(5);
    expect(callback).toBeCalledTimes(10);
  });

  it('map', () => {
    const signal: Signal<number> = new Signal();
    const callback = jest.fn();
    signal.subscribe(callback);
    const callbackMap = jest.fn();
    signal.chain(map<number, number>((value) => value + 1)).subscribe(callbackMap);
    const values: number[] = [];
    times(10, (index) => {
      values.push(index);
      signal.emit(index);
    });
    expect(callback).toBeCalledTimes(10);
    values.forEach((value, index) => expect(callback).toHaveBeenNthCalledWith(index + 1, value));

    expect(callbackMap).toBeCalledTimes(10);
    values.forEach((value, index) => expect(callbackMap).toHaveBeenNthCalledWith(index + 1, value + 1));
  });

  it('replay once', () => {
    const signal: Signal<TestObject> = new ReplaySignal();
    const callback = jest.fn();
    signal.subscribe(callback);
    const callbackOnce = jest.fn();
    signal.chain(once()).subscribe(callbackOnce);
    const value = getTestObject();
    times(10, () => signal.emit(value));
    expect(callbackOnce).toBeCalledTimes(1);
    expect(callbackOnce).toHaveBeenCalledWith(value);
    expect(callback).toBeCalledTimes(10);
  });

  it('unsubscribe', () => {
    const signal: Signal<TestObject> = new Signal();
    const callback = jest.fn();
    const unsubscribe = signal.chain(once()).subscribe(callback);
    unsubscribe();
    const value = getTestObject();
    times(10, () => signal.emit(value));
    expect(callback).toBeCalledTimes(0);
  });
});
