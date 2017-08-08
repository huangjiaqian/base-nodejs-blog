let StrUtils = {
    null2Str: function(str,src) {
        return !str?(!src?'':src):str;
    }
}
module.exports = StrUtils;