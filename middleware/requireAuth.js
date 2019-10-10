function requireAuth(req, res, next){
    const token = req.header('Authorization');
    console.log(token);
    console.log(`Entered the Authentication middleware`);
}

module.exports = {
    requireAuth,
};