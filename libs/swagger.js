let json = {
    "swagger": "2.0",
    "info": {
        "version": "1.0.0",
        "title": "api",
        "termsOfService": "http://swagger.io/terms/",
        "description": ""
    },
    "schemes": [],
    "paths": {},
    "securityDefinitions" : {
      "APIKeyHeader" : {
        "type" : "apiKey",
        "in" : "header",
        "name" : "token",
        "description" : "The value of the RQMToken returned from login or register"
      }
    },
    "definitions":{

    }
}

let temp = {
    tags: [],
    "consumes": [
        "application/x-www-form-urlencoded"
    ],
    "produces": [
        "application/json"
    ],
    parameters: [],
    "responses": {
        "200": {
            "description": "successful operation"
        },
        "201": {
            "description": "Invalid parameter supplied"
        }
    }
}

function  appToJson(key, method, ops) {
    let apis = json.paths;
    key = G.config.swagger.prefix + key;
    if (!apis[key]) {
        apis[key] = {}
    }
    if (!apis[key][method]) {
        apis[key][method] = ops
    }
}

function toApiJson(tags, config, method) {
    let temp = {
        tags: [],
        "consumes": [
            "application/x-www-form-urlencoded"
        ],
        "produces": [
            "application/json"
        ],
        parameters: [],
        "responses": {
            "200": {
                "description": "successful operation"
            },
            "400": {
                "description": "Invalid parameter supplied"
            }
        }
    }
    temp.tags.push(tags)
    temp.summary = config.desc

    let existHeaderTokenParams = config.middlewares.indexOf('auth') != -1
    let existOptionHeaderTokenParams = config.middlewares.indexOf('authOptional') != -1

    if (existHeaderTokenParams) {
        temp.summary += " (need token)"
        temp.security = [
            {
                "APIKeyHeader" : []
            }
        ]
    }

    if (existOptionHeaderTokenParams) {
        temp.summary += " (optional token)"
        temp.security = [
            {
                "APIKeyHeader" : []
            }
        ]
    }

    let tokenRuler = {};
    if (existHeaderTokenParams) {
        tokenRuler = {}
    }
    if (config.swaggerRuler) {
        temp.parameters = config.swaggerRuler
        if (existHeaderTokenParams) {}
        return temp;
    }
    if (Object.keys(config.validateRuler).length == 0) {
        if (existHeaderTokenParams) {}
        return temp;
    }


    let parameters = []
    // if (existHeaderTokenParams) {}

    let paramsIn = '';

    if (method == 'get' || method == 'GET') {
        paramsIn = 'query'
    } else {
        paramsIn = 'formData'
    }

    Object.keys(config.validateRuler).map(k => {
        let ruler = config.validateRuler[k];

        let type = ruler.type;
        let map = {
            'string': 'string',
            'number': 'integer',
            'boolean': 'boolean'
        }

        let def = ruler.value;
        let description = ruler.desc;
        let optional = !!ruler.optional;
        let enums = ruler.in;

        let swaggerRuler = {
            name: k,
            type: map[type] ? map[type] : 'string',
            default: def != undefined ? def : "",
            description: description ? description : "",
            required: !optional,
            in: paramsIn,
            enum: enums
        }
        parameters.push(swaggerRuler)
    })

    temp.parameters = parameters
    return temp;
}

class ApiSwagger {
    constructor() {}
    getJson() {
        let arr = G.allConfigs;
        arr.map(all=> {
            let tags = all.tags;
            for (let key in all) {
                if (key == 'tags') continue;
                let apiOps = all[key]
                if (apiOps.disableInSwagger) {
                    continue
                }
                let method = apiOps.method;
                method = method.toLowerCase();
                let mids = apiOps.middlewares;
                let authFlag = false;
                if (mids.indexOf('auth') != -1||mids.indexOf('authOptional') != -1) {
                    authFlag = true;
                }

                appToJson(key, method, toApiJson(tags, apiOps, method))
            }
        })
        if (G.config.swagger.https) {
            json.schemes = ["https"]
        } else {
            json.schemes = ["http"]
        }
        return json
    }
}

module.exports = new ApiSwagger();
