import { Signal } from './Signal';

export class MapSignal<T> extends Signal<T> {
  constructor(private mapFn: (value: unknown) => T) {
    super();
  }

  public emit(value: unknown): void {
    super.emit(this.mapFn(value));
  }
}
