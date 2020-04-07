const path = require('path')


const rootLocation = path.resolve(__dirname, '..')
const publicLocation = path.resolve(rootLocation, 'public')


function handleError(error) {
    return console.error(error, error.stack)
}

function last(array) {
    return array[array.length - 1]
}

function asset(...names) {
    const file = last(names)
    const parts = file.split('.')

    let prefix = ''

    if (parts.length > 1) {
        switch (last(parts)) {
            case 'html':
                prefix = 'html'
                break
        }
    }

    return path.join(publicLocation, prefix, ...names)
}


module.exports = {
    handleError: handleError,
    asset: asset,
}
