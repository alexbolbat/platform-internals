type Callback<T> = (arg: T) => void

interface Binding<T> {
  original: Callback<T>;
  binding: Callback<T>;
  isOnce: boolean;
}

export interface ExternalSignal<T = void> {
  add (cb: Callback<T>, context?: unknown): void
  once (cb: Callback<T>, context?: unknown): void
  remove (cb: Callback<T>): void
}

export class Signal<T = void> {
  private bindings: Array<Binding<T>> = []

  public add (cb: Callback<T>, context?: unknown): void {
    this.addBinding(cb, false, context)
  }

  public once (cb: Callback<T>, context?: unknown): void {
    this.addBinding(cb, true, context)
  }

  public emit (arg: T): void {
    this.bindings.forEach(binding => {
      binding.binding(arg)
    })
    this.bindings = this.bindings.filter(binding => !binding.isOnce)
  }

  public remove (cb: Callback<T>): void {
    this.bindings = this.bindings.filter(binding => binding.original !== cb)
  }

  public removeAll (): void {
    this.bindings = []
  }

  private addBinding (cb: Callback<T>, isOnce: boolean, context?: unknown): void {
    this.bindings.push({
      original: cb,
      binding: context ? cb.bind(context) : cb,
      isOnce
    })
  }
}
