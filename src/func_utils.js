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