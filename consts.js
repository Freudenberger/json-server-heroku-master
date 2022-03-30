const seedrandom = require('seedrandom');
const plugin_statuses = ["on", "off", "obsolete"]
const bearerToken = 'Bearer SecretToken'
const basicAuth = 'Basic dXNlcjpwYXNz' // user:pass


function formatErrorResponse(message, details = undefined, id = undefined) {
    return { error: { message: message, details: details }, id }
  }

function getRandomBasedOnDay() {
    const generator = seedrandom(formatYmd(new Date()));
    const randomValue = generator()

    return randomValue.toString().replace('.', '')
}

function tomorrow() {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    return formatYmd(tomorrow)
}

const formatYmd = date => date.toISOString().slice(0, 10);

exports.getRandomBasedOnDay = getRandomBasedOnDay;
exports.formatYmd = formatYmd;
exports.tomorrow = tomorrow;
exports.plugin_statuses = plugin_statuses;
exports.bearerToken = bearerToken;
exports.basicAuth = basicAuth;
exports.formatErrorResponse = formatErrorResponse;