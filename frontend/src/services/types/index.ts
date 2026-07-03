export type Service<T> = Promise<{ success: false; error: string } | { success: true; data: T }>
