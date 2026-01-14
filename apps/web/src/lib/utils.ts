type TryCatchSuccessfullResult<T> = [T, null]
type TryCatchFailedResult = [null, Error]
type TryCatchResult<T> = TryCatchSuccessfullResult<T> | TryCatchFailedResult

export async function tryCatch<T>(promise: Promise<T>): Promise<TryCatchResult<T>>  {
  try {
    const result = await promise
    return [result, null]
  } catch (error) {
    const errorObject = error instanceof Error
          ? error
          : new Error(typeof error === 'string' ? error : JSON.stringify(error))
    return [null, errorObject]
  }
}
