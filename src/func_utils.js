const debounce = (func, wait) => {
    let timeout

    return (...args) => {
        const context = this

        clearTimeout(timeout)

        timeout = setTimeout(async () => {
            await func.apply(context, args)
        }, wait)
    };
}

module.exports = {
    debounce,
}