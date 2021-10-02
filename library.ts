export interface Any {
  (...args: any[]): any;
}

interface Log {
   (fn: Function): Any;   
}

interface Memoization {
  (fn: Function): Any;
}

interface Compose {
  (...fns: Function[]): Any;
}

interface Trampoline {
  (fn: Function): Any;
}

export const log: Log = (fn: Function) => (...args: any[]): any => {
  console.log(`Computing for argument(s): ${args}`);
  return fn(...args);
};

export const memoize: Memoization = (fn: Function) => {
  const values: any = {};
  return (...args: any[]): any => {
    const key = JSON.stringify(args);
    return values.hasOwnProperty(key) ? values[key] : (values[key] = fn(...args));
  };
};

export const compose: Compose = (...fns: Function[]) => {
  const list = Array.prototype.slice.call(fns);
  const seed = list.pop();
  return list.reduceRight((accu: Function, fn: Function) => fn(accu), seed);
};

export const trampoline: Trampoline = (fn: Function) => (...args: any[]) => {
    let result: any = fn(...args);
    while ( typeof result === 'function') {
      result = result();
    }
    return result;
};

export const tailOptimizedSum: (count: number, accu: number) => Function | number = (count: number, accu: number) => {
    accu = accu ? accu : 0;
     if (count === 0) {
       return accu;
     } else {
       accu += count;
       count -= 1;
       return () => tailOptimizedSum(count, accu);
     }
}

export const recursiveSum: (count: number) => number = (count: number) => {
  let sum: number = count;
  if (count === 0) {
    return sum;
  } else {
    return sum + recursiveSum(count-1);
  }
};

