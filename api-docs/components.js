module.exports = {
    schemas: {
        register: {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                }, email: {
                    type: 'string'
                }, password: {
                    type: 'string',
                    format: 'password'
                }, role: {
                    type: 'string'
                }, phoneNumber: {
                    type: 'string'
                }, location: {
                    type: 'string'
                }
            },
            required: [
                'name',
                'email',
                'password',
                'phoneNumber',
                'location'
            ]
        }
        , login: {
            type: 'object',
            properties: {
                email: {
                    type: 'string'
                }, password: {
                    type: 'string'
                }
            },
            required: [
                'email',
                'password'
            ]

        }, getMe: {
            type: 'object'
        }, updetedetails: {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                }, email: {
                    type: 'string'
                }, password: {
                    type: 'string',
                    format: 'password'
                }, role: {
                    type: 'string'
                }, phoneNumber: {
                    type: 'string'
                }, location: {
                    type: 'string'
                }
            }
        }, deleteMe: {
            type: 'object'
        }, updatePhoto: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                }
            }
        }, updatePhotoWithUrl: {
            type: 'object',
            properties: {
                url: {
                    type: 'string'
                }
            },
            required: [
                'url'
            ]

        }
    },
    securitySchemes: {
        bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT'
        }
    }
}