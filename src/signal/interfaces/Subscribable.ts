import { UnsubscribeCallback } from '../types/UnsubscribeCallback';
import { SubscribeCallback } from '../types/SubscribeCallback';

export interface Subscribable<T> {
  subscribe(callback: SubscribeCallback<T>): UnsubscribeCallback;
}
