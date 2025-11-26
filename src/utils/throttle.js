export const throttle = (fn, time = 500) => {
    let lastExecuted = 0;
    return function(...args) {
        const context = this;
        const now = Date.now();
        if (now - lastExecuted >= time) {
            lastExecuted = now;
            fn.apply(context, args);
        }
    };
};
