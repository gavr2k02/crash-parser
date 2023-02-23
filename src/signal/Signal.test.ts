import { random, times } from 'lodash';
import { Signal } from './Signal';
import { getTestObject } from './tests/helpers';

describe('Signal', () => {
  test('subscribe', () => {
    const signal: Signal<unknown> = new Signal();
    const value = getTestObject();
    const callback = jest.fn();
    signal.subscribe(callback);
    signal.emit(value);
    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(value);
  });

  test('same callback multiple subscribes', () => {
    const signal: Signal<unknown> = new Signal();
    const value = getTestObject();
    const callback = jest.fn();

    times(random(10, 100), () => signal.subscribe(callback));
    signal.emit(value);
    expect(callback).toBeCalledTimes(1);
    expect(callback).toBeCalledWith(value);
  });

  test('multiple callbacks', () => {
    const signal: Signal<unknown> = new Signal();
    const value = getTestObject();
    const count = random(10, 100);
    const callbacks = [];

    times(count, () => {
      const callback = jest.fn();
      callbacks.push(callback);
      signal.subscribe(callback);
    });

    signal.emit(value);
    callbacks.forEach((callback) => {
      expect(callback).toBeCalledTimes(1);
      expect(callback).toBeCalledWith(value);
    });
  });

  test('unsubscribe', () => {
    const signal: Signal<unknown> = new Signal();
    const value = getTestObject();
    const callback = jest.fn();
    const unsubscribe = signal.subscribe(callback);
    signal.emit(value);
    expect(callback).toBeCalledTimes(1);
    expect(callback).toHaveBeenNthCalledWith(1, value);
    signal.emit(value);
    expect(callback).toBeCalledTimes(2);
    expect(callback).toHaveBeenNthCalledWith(2, value);
    unsubscribe();
    signal.emit(value);
    expect(callback).toBeCalledTimes(2);
  });

  test('length', () => {
    const signal = new Signal();
    expect(signal.length).toBe(0);
    const count = random(10, 100);
    times(count, () => signal.subscribe(jest.fn()));
    expect(signal.length).toBe(count);
  });
});
