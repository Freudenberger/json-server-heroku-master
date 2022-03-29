const seedrandom = require('seedrandom');

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