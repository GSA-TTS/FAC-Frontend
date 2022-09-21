const baseUrl = process.env.BASEURL;

exports.temporaryAuthToken = process.env.FAC_TEMP_BASIC_AUTH_STRING;
exports.baseUrl = typeof baseUrl !== 'undefined' ? baseUrl + '/' : '/';
exports.IN_CI = process.env.IN_CI || false;
