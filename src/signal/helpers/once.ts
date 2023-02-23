import { SubscribableEmitable } from '../interfaces/SubscribableEmitable';
import { OnceSignal } from '../OnceSignal';

export function once<T>(): SubscribableEmitable<T> {
  return new OnceSignal<T>();
}
