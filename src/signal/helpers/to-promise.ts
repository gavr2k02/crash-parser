import { Subscribable } from '../interfaces/Subscribable';
import { UnsubscribeCallback } from '../types/UnsubscribeCallback';

export function toPromise<T>(subscribable: Subscribable<T>): Promise<T> {
  return new Promise<T>((resolve) => {
    let unsubscribe: UnsubscribeCallback;

    // eslint-disable-next-line prefer-const
    unsubscribe = subscribable.subscribe((value) => {
      unsubscribe ? unsubscribe() : setTimeout(() => unsubscribe());
      resolve(value);
    });
  });
}
