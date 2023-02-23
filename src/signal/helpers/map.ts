import { SubscribableEmitable } from '../interfaces/SubscribableEmitable';
import { MapSignal } from '../MapSignal';

export function map<S, T>(mapFn: (value: S) => T): SubscribableEmitable<T> {
  return new MapSignal<T>(mapFn);
}
