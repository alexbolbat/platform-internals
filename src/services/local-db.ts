export interface DbIndex<T> {
  keyPath: keyof T & string
  name?: string
  unique?: boolean
}

export interface LocalDbProps<T> {
  dbName: string
  keyPath: keyof T & string
  indexes?: DbIndex<T>[]
}

interface DbEventTarget extends EventTarget {
  result: IDBDatabase
}

export class LocalDb<T> {
  private readonly props: LocalDbProps<T>

  private db?: IDBDatabase

  constructor (props: LocalDbProps<T>) {
    this.props = props
  }

  open (): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.props.dbName, 2);

      request.onerror = event => {
        const target = event.target as IDBRequest
        reject(target.error)
      }

      request.onsuccess = event => {
        const target = event.target as DbEventTarget
        this.db = target.result

        resolve()
      }

      request.onupgradeneeded = event => {
        const target = event.target as DbEventTarget
        const db = target.result

        const objectStore = db.createObjectStore('users', {
          keyPath: this.props.keyPath
        });

        if (this.props.indexes) {
          this.props.indexes.forEach(index =>
            objectStore.createIndex(index.name ?? index.keyPath, index.keyPath, {
              unique: index.unique ?? false
            }))
        }
      };
    })
  }

  add (value: T): Promise<void> {
    return this.getStoreDbRequestPromise(
      store => store.add(value),
      () => {}
    )
  }

  async getAll (): Promise<T[]> {
    return this.getStoreDbRequestPromise(
      store => store.getAll(),
      event => {
        const request = event.target as IDBRequest
        return request.result
      }
    )
  }

  edit (value: T): Promise<void> {
    return this.getStoreDbRequestPromise(
      store => store.put(value),
      () => {}
    )
  }

  delete (userName: string): Promise<void> {
    return this.getStoreDbRequestPromise(
      store => store.delete(userName),
      () => {}
    )
  }

  close (): void {
    this.db?.close()
  }

  private getEmptyDbError (): Error {
    return new Error('no db was opened')
  }

  private getStoreDbRequestPromise<ReqData, R> (
    getRequest: (store: IDBObjectStore) => IDBRequest<ReqData>,
    getResult: (event: Event) => R
  ): Promise<R> {
    return new Promise((resolve, reject) => {
      if (!this.db) {
        return reject(this.getEmptyDbError())
      }
      const store = this.db.transaction(this.props.dbName, 'readwrite').objectStore(this.props.dbName)
      const request = getRequest(store)
      request.onsuccess = event => resolve(getResult(event))
      request.onerror = event => {
        const request = event.target as IDBRequest
        reject(request.error ?? new Error())
      }
    })
  }
}
