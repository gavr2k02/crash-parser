import { SubscribableEmitable } from './interfaces/SubscribableEmitable';
import { Subscribable } from './interfaces/Subscribable';
import { UnsubscribeCallback } from './types/UnsubscribeCallback';
import { SubscribeCallback } from './types/SubscribeCallback';
import { last, partial } from 'lodash';

export class Chain<T> implements Subscribable<T> {
  private readonly items: SubscribableEmitable<unknown>[];
  private unsubscribes: UnsubscribeCallback[] = [];
  private subscribeCount = 0;

  constructor(...items: SubscribableEmitable<unknown>[]) {
    this.items = items;
  }

  public subscribe(callback: SubscribeCallback<T>): UnsubscribeCallback {
    const unsubscribe = last(this.items).subscribe(callback);

    if (this.subscribeCount === 0) {
      this.createSubscribes();
    }

    this.subscribeCount++;

    return () => {
      unsubscribe();
      this.subscribeCount--;
      this.subscribeCount === 0 && this.removeSubscribes();
    };
  }

  private createSubscribes(): void {
    this.items.forEach((item, index) => this.unsubscribes.push(item.subscribe(partial(this.handleSubscribe, index))));
  }

  private removeSubscribes(): void {
    this.unsubscribes.forEach((unsubscribe) => unsubscribe());
    this.unsubscribes = [];
  }

  private handleSubscribe = (index: number, value: unknown) => {
    const item = this.items[index + 1];
    item?.emit(value);
  };
}
