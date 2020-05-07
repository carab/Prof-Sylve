/**
 * Type adding null to all object keys.
 */
export type Nullable<T> = { [P in keyof T]: T[P] | null };

/**
 * Type adding null or undefined to all object keys.
 * Used for models returned by the API, which cannot be trusted as it may not be up to date.
 */
export type Untrustable<T> = { [P in keyof T]?: T[P] | null };

/**
 * Type allowing to override keys in the original type
 */
export type Override<Original, Over> = Omit<Original, keyof Over> & Over;
