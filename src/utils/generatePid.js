const { v4: uuid4 } = require('uuid');

const generateUniqueId = () => {
    const uniqueId = `Test-widget-${uuid4()}`;
    return uniqueId;
}

module.exports = generateUniqueId;