import { UnsubscribeCallback } from './types/UnsubscribeCallback';
import { SubscribableEmitable } from './interfaces/SubscribableEmitable';
import { SubscribeCallback } from './types/SubscribeCallback';
import { Chain } from './Chain';
import { Subscribable } from './interfaces/Subscribable';

export class Signal<T> implements SubscribableEmitable<T> {
  private readonly callbacks: Array<SubscribeCallback<T>> = [];

  public subscribe(callback: SubscribeCallback<T>): UnsubscribeCallback {
    if (this.callbacks.includes(callback)) {
      return;
    }

    this.callbacks.push(callback);

    return this.unsubscribe.bind(this, callback) as UnsubscribeCallback;
  }

  protected unsubscribe(callback: SubscribeCallback<T>): void {
    const index: number = this.callbacks.indexOf(callback);
    index > -1 && this.callbacks.splice(index, 1);
  }

  public emit(value?: T): void {
    const callbacks = this.callbacks.concat();
    callbacks.forEach((callback) => callback(value));
  }

  public chain<S>(...items: SubscribableEmitable<unknown>[]): Subscribable<S> {
    return new Chain(...[this, ...items]);
  }

  public get length(): number {
    return this.callbacks.length;
  }
}
