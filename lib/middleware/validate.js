function parseField(field) {						//parse entry[name] notation
    return field
        .split(/\[|\]/)
        .filter(function (s) {
            return s
        });

}

function getField(req, field) {					//look up property based on parseField() results
    var val = req.body;
    field.forEach(function (prop) {
        val = val[prop];
    });
    return val;
};

exports.required = function (field) {				//parse field once
    field = parseField(field);
    return function (req, res, next) {
        if (getField(req, field)) {				//on each request check if field has value--  if it does, move on to next middleware component
            next();
        } else {
            res.error(field.join(' ') + ' is required'); 		//if not, display an error
            res.redirect('back');
        }
    }
};

exports.lengthAbove = function (field, len) {
    field = parseField(field);
    return function (req, res, next) {
        if (getField(req, field).length > len) {
            next();
        } else {
            res.error(field.join(' ') + ' must have more than ' + len + ' characters');
            res.redirect('back');
        }
    }
};