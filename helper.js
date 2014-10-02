var fs      = require('fs')

var stringifier = function stringifier(o) {
    var cache = [];
    return JSON.stringify(o, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, replace key
                return 'Circular reference to: ' + key
            }
            // Store value in our collection
            cache.push(value)
        }
        return value
    }, '\t')
}

var consoleStream = fs.createWriteStream('./console.log', {flags:'a'})
var sysLogStream = fs.createWriteStream('./system.log', {flags:'a'})
var message_q = []
var swLog = window.swLog = function swLog(message, scope) {
    console.log(message)
    if (scope === undefined)
        scope = 'INFO'
    now = new Date()
    message_q.push(scope + ' ' + message)
    if (window.document.body !== null) {
        var console_DOM = window.document.getElementById('console')
        if (console_DOM === null) {
            console_DOM = document.createElement('pre')
            console_DOM.id = 'console'
            document.body.appendChild(console_DOM)
        }
        console_DOM.textContent = message_q.join('\n') + '\n' + console_DOM.textContent
        message_q = []
    }
    if (scope === 'SYSTEM')
        sysLogStream.write(now.toString().slice(0,24) + ': ' + message + '\n')
    else
        consoleStream.write(now.toString().slice(0,24) + ' ' + scope + ': ' + message + '\n')
}

var progress = window.progress = function progress(message) {
    if (window.document.body !== null) {
        var progress_DOM = window.document.getElementById('progress')
        if (progress_DOM === null) {
            progress_DOM = document.createElement('pre')
            progress_DOM.id = 'progress'
            document.body.appendChild(progress_DOM)
        }
        progress_DOM.textContent = message
    }
    return {
        finish: function() {
            document.getElementById('progress').style.display = 'none'
        }
    }
}

var bytesToSize = function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes == 0) return 'n/a'
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)))
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i]
}