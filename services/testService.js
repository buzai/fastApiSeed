const BaseService = require('./baseService.js');

class TestService extends BaseService {
    async foo() {
        console.log('info foo');
        return { foo: 'foo' }
    }
}

module.exports = TestService;
