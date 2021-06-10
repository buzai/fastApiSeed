const secretKey = 'xxxx';
const jsonwebtoken = require('jsonwebtoken');

class Token {
    constructor() {
        let seconds = 60 * 60 * 24 * 10;
        this.expToAdd = seconds;
        this.secretKey = secretKey;
    }

    createToken(payload, exp) {
        if (!exp) {
            payload.exp = Math.floor(Date.now() / 1000) + this.expToAdd;
        } else {
            payload.exp = Math.floor(Date.now() / 1000) + exp;
        }

        payload.iat = Math.floor(Date.now() / 1000);
        let token = jsonwebtoken.sign(payload, this.secretKey);
        return token;
    }

    decodeToken(token) {
        let decoded = jsonwebtoken.verify(token, this.secretKey);
        return decoded;
    }
}

module.exports = new Token();
