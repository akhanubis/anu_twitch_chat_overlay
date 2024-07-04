// Creates a function that executes another function after a wait time, 
// the wait time is reset every time the returned function is called
const debounce = (func, wait) => {
    let timeout

    return (...args) => {
        const context = this

        clearTimeout(timeout)

        timeout = setTimeout(async () => {
            await func.apply(context, args)
        }, wait)
    }
}

// Executes a function on an interval until either it returns a truthy value or the timeout is reached 
function doOnIntervalWithTimeout(func, interval, timeout) {
    let intervalId, timeoutId
    let promiseResolve

    const stopInterval = () => {
        clearInterval(intervalId)
        clearTimeout(timeoutId)
    }

    const promise = new Promise((resolve) => {
        promiseResolve = resolve

        const result = func()
        if (result) {
            resolve(result)
            return
        }

        intervalId = setInterval(() => {
            const result = func()
            if (result) {
                stopInterval()
                resolve(result)
            }
        }, interval)

        timeoutId = setTimeout(() => {
            stopInterval()
            resolve(false)
        }, timeout)
    })

    promise.cancel = () => {
        stopInterval()
        promiseResolve(false)
    }

    return promise
}

// Creates a function that executes another function using doOnIntervalWithTimeout, 
// the resulting promise is replaced with a new one whenever the returned function is called
function doOnIntervalWithTimeoutAndOverwrite(func, interval, timeout) {
    let promise

    return function () {
        const context = this

        if (promise) promise.cancel()

        promise = doOnIntervalWithTimeout(() => func.apply(context), interval, timeout)

        return promise
    }
}

module.exports = {
    debounce,
    doOnIntervalWithTimeout,
    doOnIntervalWithTimeoutAndOverwrite,
}