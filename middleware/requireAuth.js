const ThingsService = require('../src/things/things-service');

function requireAuth(req, res, next){
    const authToken = req.get('Authorization') || '';
    let basicToken;

    if(!authToken.toLowerCase().startsWith(`basic `)){
        return res
            .status(401)
            .json({
                error: {
                    message: `Missing basic token`
                }
            })
    }else{
        basicToken = authToken.slice(`basic `.length, authToken.length);
    }
    
    const [tokenUsername, tokenPassword] = Buffer
        .from(basicToken, 'base64')
        .toString()
        .split(':');

    if(!tokenUsername || !tokenPassword){
        return res
            .status(401)
            .json({
                error: {
                    message: 'Unauthorized request'
                }
            })
    }

    req.app.get('db')('thingful_users')
        .where({ user_name: tokenUsername })
        .first()
        .then((user) => {
            if(!user || user.password !== tokenPassword){
                return res
                    .status(401)
                    .json({
                        error: {
                            message: 'Unauthorized request'
                        }
                    })
            }
            req.user = user;
            next();
        })
        .catch(next);
}

module.exports = {
    requireAuth,
};