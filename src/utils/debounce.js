export const debounce = (fn, time = 500) => {
    let timeoutId;
    return function(...args) {
        const context = this; 
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn.apply(context, args);
        }, time);
    };
};