import { Subscribable } from './Subscribable';
import { Emitable } from './Emitable';

export interface SubscribableEmitable<T> extends Subscribable<T>, Emitable<T> {}
