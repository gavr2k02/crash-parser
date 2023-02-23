import { Signal } from './Signal';

export class FilterSignal<T> extends Signal<T> {
  constructor(private filterFn: (value: T) => boolean) {
    super();
  }

  public emit(value: T) {
    this.filterFn(value) && super.emit(value);
  }
}
