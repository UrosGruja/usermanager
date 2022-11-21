const auth = require('./route/Auth');
const user = require('./route/User');

module.exports = {
    '/auth/register': auth.register,
    '/auth/login': auth.login,
    '/auth/me': auth.getMe,
    '/auth/updetedetails': auth.updetedetails,
    '/auth/deleteme': auth.deleteMe,
    '/auth/updatephoto': auth.updatePhoto,
    '/auth/updatePhotoWithUrl': auth.updatePhotoWithUrl,

    '/users': user.get_post,
    '/users/{id}': user.get_put_delete,
    '/users/{id}': user.get_put_delete,
    '/users/{id}': user.get_put_delete

}