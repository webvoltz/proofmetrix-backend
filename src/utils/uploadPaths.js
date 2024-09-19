const getPath = (originalUrl) => {
    let path;

    if (process.env.VARIABLE === "Production") {
        path = `Test/production/`;
    } else if (process.env.VARIABLE === "Staging") {
        path = `Test/staging/`;
    } else {
        path = 'Test/local/'
    }

    return `${path}`
};
module.exports = { getPath };

