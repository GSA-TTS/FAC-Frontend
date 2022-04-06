const baseUrl = process.env.BASEURL;

exports.baseUrl = typeof baseUrl !== 'undefined' ? baseUrl + '/' : '/';
