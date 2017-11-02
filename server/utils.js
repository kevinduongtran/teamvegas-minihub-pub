var _ = require('underscore');
var Slack = require('slack-node');
var app = require('./app.js');
webhookUri = "SLACK WEBHOOK URL HERE";

slack = new Slack();
slack.setWebhook(webhookUri);

var msgSlack = function(msg,doOnDevelop) {
    if (doOnDevelop || app.get('env') == 'production') {
        slack.webhook({
            channel: "#automation-alerts",
            username: "Auto-Bot",
            text: app.get('env') + ":" + app.get('port') + " - " + msg
        }, function(error, response) {

        });
    }

}

var ccGetLastFour = function(ccnum) {
    return ccnum.replace(/.(?=.{4})/g, '');
}
var objToURLForm = function(obj) {
    var str = [];
    for (var p in obj)
        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    return str.join("&");
}

var URLFormToObj = function(str) {
    var obj = {};
    var arr = [];
    arr = str.split("&");
    for (var i in arr) {
        obj[arr[i].split('=')[0]] = arr[i].split('=')[1];
    }
    return obj;
}

var isEmpty = function(obj) {
    if (obj === null)
        return true;
    return Object.keys(obj).length === 0;
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function resJSON(res, err, result) {
    var stat = {
        'status': 'failed'
    }
    if (err == null) {
        stat['status'] = 'success'
    } else
        stat['error'] = err
    if (result) {
        stat['result'] = result
    }
    console.log(JSON.stringify(stat));
    res.json(stat);
}
var findDeep = function(items, attrs) {

    function match(value) {
        for (var key in attrs) {
            if (!_.isUndefined(value)) {
                if (attrs[key] !== value[key]) {
                    return false;
                }
            }
        }

        return true;
    }

    function traverse(value) {
        var result;

        _.forEach(value, function(val) {
            if (match(val)) {
                result = val;
                return false;
            }

            if (_.isObject(val) || _.isArray(val)) {
                result = traverse(val);
            }

            if (result) {
                return false;
            }
        });

        return result;
    }

    return traverse(items);

}
var isFunction = function(functionToCheck) {
    var getType = {};
    return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}
module.exports = {
    objToURLForm: objToURLForm,
    URLFormToObj: URLFormToObj,
    isEmpty: isEmpty,
    validateEmail: validateEmail,
    resJSON: resJSON,
    findDeep: findDeep,
    ccGetLastFour: ccGetLastFour,
    isFunction: isFunction,
    msgSlack: msgSlack
};