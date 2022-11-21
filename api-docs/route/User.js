const { query } = require("express");
const paths = require("../paths");

module.exports = {
    get_post: {
        get: {
            tags: ['User'],
            summary: 'Get the list of all users',
            produces: ['application/json'],
            consumes: ['application/json'],
            security: [{ bearerAuth: [] }],
            responses: {
                '201': {
                    description: 'Successfully returned.'
                },
                '409': {
                    description: 'Email already exist.'
                },
                '500': {
                    description: 'Internal server error'
                }
            }
        },
        post: {
            tags: ['User'],
            summary: 'Create a new user',
            produces: ['application/json'],
            consumes: ['application/json'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
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
                            }, required: [
                                'name',
                                'email',
                                'password',
                                'phoneNumber',
                                'location'
                            ]
                        }
                    }
                }
            },
            security: [{ bearerAuth: [] }],
            responses: {
                '201': {
                    description: 'User successfully updated.'
                },
                '409': {
                    description: 'Email already exist.'
                },
                '500': {
                    description: 'Internal server error'
                }
            }
        }
    }, get_put_delete: {
        get: {
            tags: ['User'],
            summary: 'Return single user account',
            produces: ['application/json'],
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    type: 'string'
                }
            ],
            security: [{ bearerAuth: [] }],
            responses: {
                '201': {
                    description: 'User successfully created. An verification email will be sent.'
                },
                '409': {
                    description: 'Email already exist.'
                },
                '500': {
                    description: 'Internal server error'
                }
            }
        },
        put: {
            tags: ['User'],
            summary: 'Update single user account',
            produces: ['application/json'],
            consumes: ['application/json'],
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    type: 'string'
                }
            ],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: {
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
                            }, required: [
                                'name',
                                'email',
                                'password',
                                'phoneNumber',
                                'location'
                            ]
                        }
                    }
                }
            },
            security: [{ bearerAuth: [] }],
            responses: {
                '201': {
                    description: 'User successfully created. An verification email will be sent.'
                },
                '409': {
                    description: 'Email already exist.'
                },
                '500': {
                    description: 'Internal server error'
                }
            }
        },
        delete: {
            tags: ['User'],
            summary: 'Dlete singe user account',
            produces: ['application/json'],
            parameters: [
                {
                    in: 'path',
                    name: 'id',
                    required: true,
                    type: 'string'
                }
            ],
            security: [{ bearerAuth: [] }],
            responses: {
                '201': {
                    description: 'User successfully created. An verification email will be sent.'
                },
                '409': {
                    description: 'Email already exist.'
                },
                '500': {
                    description: 'Internal server error'
                }
            }
        }
    }
}