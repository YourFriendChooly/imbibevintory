'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _lcboParser = require('../utils/lcboParser');

var _lcboParser2 = _interopRequireDefault(_lcboParser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var lcboInvUrl = 'http://www.lcbo.com/webapp/wcs/stores/servlet/ProductStoreInventoryView';

router.get('/inv/:brand', function (req, res) {
    console.log("Requested Brand Inventory");
    var partNumber = parseInt(req.params.brand);
    var params = req.query;
    var lcboInvParams = {
        "catalogId": 10001,
        "langId": -1,
        "partNumber": partNumber,
        "storeId": 10151
    };
    _axios2.default.get(lcboInvUrl, {
        params: lcboInvParams,
        headers: {
            "cache-control": "no-cache",
            "upgrade-insecure-requests": "1",
            "dnt": "1",
            "host": "www.lcbo.com"
        }
    }).then(function (resp) {
        new _lcboParser2.default(resp.data, params, function (parsed) {
            res.send(parsed);
        }).parseInventory();
    }).catch(function (err) {
        res.send(err);
    });
});

exports.default = router;
//# sourceMappingURL=lcbo.js.map