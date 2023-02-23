export interface Emitable<T> {
  emit(value?: T): void;
}
