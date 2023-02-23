import { FilterSignal } from '../FilterSignal';
import { SubscribableEmitable } from '../interfaces/SubscribableEmitable';

export function filter<T>(filterFn: (value: T) => boolean): SubscribableEmitable<T> {
  return new FilterSignal(filterFn);
}
