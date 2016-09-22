function uuid(len) {
    var buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

function respond (err, obj, res) {
    if(err){
        if(err.errors){
            const errors = Object.keys(err.errors).map(field => err.errors[field].message);
            res.json(errors);
        }else{
            res.json(err);
        }
    }else{
        res.json(obj);
    }
};

module.exports = {
    uuid,
    respond
};