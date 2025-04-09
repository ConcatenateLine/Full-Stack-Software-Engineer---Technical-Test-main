export default function Debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | null = null;

  return function (this: any, ...args: Parameters<T>) {
    console.log("Debounce called"); // Log when the wrapper is invoked

    if (timeoutId !== null) {
      console.log("Clearing timeout");
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      console.log("Executing debounced function");
      func.apply(this, args); // Execute the function
      timeoutId = null;
    }, wait);
  };
}
