
'use strict';

module.exports.getServiceCreds = function(name) {
    if (process.env.VCAP_SERVICES) {
        var services = JSON.parse(process.env.VCAP_SERVICES);
        for (var service_name in services) {
            if (service_name.indexOf(name) === 0) {
                var service = services[service_name][0];
                return service.credentials;
            }
        }
    }
    return {};
};
