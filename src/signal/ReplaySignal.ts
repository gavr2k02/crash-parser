import { Signal } from './Signal';
import { SubscribeCallback } from './types/SubscribeCallback';
import { UnsubscribeCallback } from './types/UnsubscribeCallback';
import { GetValue } from './interfaces/GetValue';

export class ReplaySignal<T> extends Signal<T> implements GetValue<T> {
  private _value: T;
  private isEmitted: boolean;

  public emit(value: T): void {
    this._value = value;
    this.isEmitted = true;
    super.emit(value);
  }

  public subscribe(callback: SubscribeCallback<T>): UnsubscribeCallback {
    const result: UnsubscribeCallback = super.subscribe(callback);

    if (this.isEmitted) {
      callback(this._value);
    }

    return result;
  }

  public get value(): T {
    return this._value;
  }
}
