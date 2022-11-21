module.exports = {
    openapi: "3.0.0",
    info: {
        title: "API",
        version: "1.0.0",
        description: "User manager API"
    },
    servers: [
        {
            url: "http://localhost:8080/api/v1",
            description: 'Server'
        }
    ],
};