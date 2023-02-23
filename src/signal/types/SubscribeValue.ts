import { SubscribeCallback } from './SubscribeCallback';
import { Emitable } from '../interfaces/Emitable';

export type SubscribeValue<T> = SubscribeCallback<T> | Emitable<T>;
