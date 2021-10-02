import { log, memoize, compose, trampoline, tailOptimizedSum, recursiveSum, Any } from './library';
import { startCreateEmailTransaction, startAnnouncement } from './demo-usecase';

// Basic higher order function and composition usage
const basic: Function = (): void => {
  let sqrt: Any = log(Math.sqrt);
  let add: Any = log((x: number, y: number) => x + y);
  let echo: Any = log((x: string): string => x)

  let memoizedSqrt = memoize(sqrt);
  let memoizedAdd = memoize(add);
  let memoizedEcho = memoize(echo);

  // First time calls
  console.log('Computed (Basic Function Demo):');
  console.log('---------------------------------');
  console.log('Square root result', memoizedSqrt(16));
  console.log('Addition result', memoizedAdd(16, 10));
  console.log('Echo result', memoizedEcho('Echoeeeeeeeeeeeeeeeed'));

  // Subsequent calls
  console.log('\n');
  console.log('Optimized (Basic Function Demo):');
  console.log('--------------------------------');
  console.log('Square root result', memoizedSqrt(16));
  console.log('Addition result', memoizedAdd(16, 10));
  console.log('Echo result', memoizedEcho('Echoeeeeeeeeeeeeeeeed'));
};

// Create logic pipelines using function composition
const composition: Function = (): void => {

  const memoizedSqrt = compose(memoize, log, Math.sqrt);
  const memoizedAdd = compose(memoize, log, (x: number, y: number): number => x + y);
  const memoizedEcho= compose(memoize, log, (x: string): string => x);

    // First calls
  console.log('Computed - (Composition Function Demo):');
  console.log('----------------------------------------');
  console.log('Square root result', memoizedSqrt(16));
  console.log('Addition result', memoizedAdd(16, 10));
  console.log('Echo result', memoizedEcho('Echoeeeeeeeeeeeeeeeed'));

  // Subsequent calls
  console.log('\n');
  console.log('Optimized (Composition Function Demo):');
  console.log('---------------------------------------');
  console.log('Square root result', memoizedSqrt(16));
  console.log('Addition result', memoizedAdd(16, 10));
  console.log('Echo result', memoizedEcho('Echoeeeeeeeeeeeeeeeed'));
};

// Invoke transaction pipelines defined demo usecase
const usecaseDemo: Function = (): void => {
  /*--------------Execute business transaction pipelines------------------------------*/
  // Create email for the user now
  startCreateEmailTransaction('sandeep', 'mohanty');

  // Sent out an organization announcement after 10 seconds
  setTimeout(() => startAnnouncement('Announcement: Business will remain closed tomorrow'), 5000);

  // Create email for the malicious user
  setTimeout(() => startCreateEmailTransaction('malicious', 'user'), 15000);
}

// Calculating sum using tail-optimized trampoline method (prevents stack-overflow)
const invoketailOptimizedSum: Function = (): void => {
    console.log('Tail Optimized Sum: ', trampoline(tailOptimizedSum)(10000));
};

// Calculating sum using normal recursive method which is not tail-optimized (could result in stack-overflow)
const invokeRecursiveSum: Function = (): void => {
    console.log('Recursive Sum: ', recursiveSum(10000));
}

// Show demo
const executeDemos: (demoId: number) => void = (demoId: number): void => {
    let invocations: Map<number, Function> = new Map<number, Function>();
    invocations.set(1, basic);
    invocations.set(2, composition);
    invocations.set(3, usecaseDemo);
    invocations.set(4, invoketailOptimizedSum);
    invocations.set(5, invokeRecursiveSum);
    let selectedFunction = invocations.get(demoId);
    if ( selectedFunction ) {
      selectedFunction(demoId);
    } else {
      console.log('Invalid option');
    }
};

executeDemos(3);