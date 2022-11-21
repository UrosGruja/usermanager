module.exports = {
    register: {
        post: {
            tags: ['Auth'],
            summary: 'Register an user account',
            produces: ['application/json'],
            consumes: ['application/json'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/register' }
                    }
                }
            },
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
    },
    login: {
        post: {
            tags: ['Auth'],
            summary: 'User login with email and password',
            produces: ['application/json'],
            consumes: ['application/json'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/login' }
                    }
                }
            },
            responses: {
                '200': {
                    description: 'User login successfully, with API access token provided.'
                },
                '401': {
                    description: 'Auth failed with an incorrect password.'
                },
                '404': {
                    description: 'This user account is not found.'
                },
                '500': {
                    description: 'Internal server error.'
                }
            }
        }
    },
    getMe: {
        get: {
            tags: ['Auth'],
            summary: 'Return user with email and password',
            produces: ['application/json'],
            consumes: ['application/json'],
            security: [{ bearerAuth: [] }],
            responses: {
                '201': {
                    description: 'User successfully returned.'
                },
                '409': {
                    description: 'Email already exist.'
                },
                '500': {
                    description: 'Internal server error'
                }
            }
        }
    },updetedetails: {
        put: {
            tags: ['Auth'],
            summary: 'Update yourself',
            produces: ['application/json'],
            consumes: ['application/json'],
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/updetedetails' }
                    }
                }
            },
            security: [{ bearerAuth: [] }],
            responses: {
                '201': {
                    description: 'Successfully updated user.'
                },
                '409': {
                    description: 'Email already exist.'
                },
                '500': {
                    description: 'Internal server error'
                }
            }
        }
    },  deleteMe: {
        delete: {
            tags: ['Auth'],
            summary: 'Deleted yourself',
            produces: ['application/json'],
            consumes: ['application/json'],
            security: [{ bearerAuth: [] }],
            responses: {
                '201': {
                    description: 'User successfully deleted.'
                },
                '409': {
                    description: 'Email already exist.'
                },
                '500': {
                    description: 'Internal server error'
                }
            }
        }
    }, updatePhoto: {
        put: {
            tags: ['Auth'],
            summary: 'Upload and update your photo',
            consumes: 'multipart/form-data',
            requestBody: {
                content: {
                    'multipart/form-data': {
                        schema: { $ref: '#/components/schemas/updatePhoto' }
                    }
                }
            },
            security: [{ bearerAuth: [] }],
            responses: {
                '201': {
                    description: 'Successfully updated.'
                },
                '409': {
                    description: 'Email already exist.'
                },
                '500': {
                    description: 'Internal server error'
                }
            }
        }
    },updatePhotoWithUrl: {
        put: {
            tags: ['Auth'],
            summary: 'Upload and update your photo with url',
            requestBody: {
                required: true,
                content: {
                    'application/json': {
                        schema: { $ref: '#/components/schemas/updatePhotoWithUrl' }
                    }
                }
            },
            security: [{ bearerAuth: [] }],
            responses: {
                '201': {
                    description: 'Successfully updated.'
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

};