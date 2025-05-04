/**
 * TypeScript类型工具
 */

// 确保属性非空
export type NonNullableProps<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

// 确保属性可选
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

// 确保属性必需
export type Required<T> = {
  [P in keyof T]-?: T[P];
};

// 从类型中选择特定属性
export type PickProps<T, K extends keyof T> = {
  [P in K]: T[P];
};

// 从类型中排除特定属性
export type OmitProps<T, K extends keyof T> = {
  [P in Exclude<keyof T, K>]: T[P];
};

// 将属性设为只读
export type ReadonlyProps<T> = {
  readonly [P in keyof T]: T[P];
};

// 将属性设为可写
export type WritableProps<T> = {
  -readonly [P in keyof T]: T[P];
};

// 从联合类型中提取特定类型
export type ExtractType<T, U> = T extends U ? T : never;

// 从联合类型中排除特定类型
export type ExcludeType<T, U> = T extends U ? never : T;

// 条件类型
export type If<C extends boolean, T, F> = C extends true ? T : F;

// 记录类型
export type Dict<T> = Record<string, T>;

// 可为空类型
export type Nullable<T> = T | null;

// 可为空或未定义类型
export type Optional<T> = T | null | undefined;

// 函数类型
export type Func<Args extends any[] = any[], Return = any> = (...args: Args) => Return;

// 异步函数类型
export type AsyncFunc<Args extends any[] = any[], Return = any> = (...args: Args) => Promise<Return>;

// 构造函数类型
export type Constructor<T = any> = new (...args: any[]) => T;

// 键值对类型
export type KeyValue<K extends string | number | symbol = string, V = any> = {
  [P in K]: V;
};

// 提取Promise的返回类型
export type PromiseType<T> = T extends Promise<infer U> ? U : never;

// 提取数组元素类型
export type ArrayElement<T> = T extends Array<infer U> ? U : never;

// 提取函数参数类型
export type Parameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any ? P : never;

// 提取函数返回类型
export type ReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R ? R : never;
