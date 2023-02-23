import { Signal } from './Signal';
import { SubscribeCallback } from './types/SubscribeCallback';
import { UnsubscribeCallback } from './types/UnsubscribeCallback';

export class OnceSignal<T> extends Signal<T> {
  public subscribe(callback: SubscribeCallback<T>): UnsubscribeCallback {
    const unsubscribe = super.subscribe((value) => {
      unsubscribe ? unsubscribe() : setTimeout(() => unsubscribe());
      callback(value);
    });

    return unsubscribe;
  }
}
