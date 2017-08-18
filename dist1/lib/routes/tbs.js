'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _beerStoreParser = require('../utils/beerStoreParser');

var _beerStoreParser2 = _interopRequireDefault(_beerStoreParser);

var _dbOps = require('../utils/dbOps');

function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : { default: obj };
}

var router = _express2.default.Router();
var beerStore = 'http://www.thebeerstore.ca/beers/inventory';

router.get('/stores', function (req, res) {
    console.log("Requested Stores Resource");
    var dbConnection = new _dbOps.dbInterface('TBS_Store');
    dbConnection.get().then(function (resp) {
        res.send(resp);
    }).catch(function (err) {
        console.log("Error");
    });
});

router.get('/inv/:store/:brand', function (req, res, next) {
    _axios2.default.get(beerStore + '/' + req.params.brand + '/' + req.params.store).then(function (resp) {
        var bsParse = new _beerStoreParser2.default(resp.data, function (results) {
            res.send(results);
        });
        bsParse.parseInventory();
    });
});

router.get('/inv/:store', function (req, res, next) {
    var beerIDs = {
        4111: "PHA",
        4112: "SNPA",
        4115: "NHA"
    };
    var inventoryArray = [];
    var beerId = 0;
    _axios2.default.all(Object.keys(beerIDs).map(function (id) {
        return _axios2.default.get(beerStore + '/' + id + '/' + req.params.store);
    })).then(_axios2.default.spread(function () {
        for (var _len = arguments.length, inventory = Array(_len), _key = 0; _key < _len; _key++) {
            inventory[_key] = arguments[_key];
        }

        inventory.map(function (responseObject) {
            new _beerStoreParser2.default(responseObject.data, function (scrapeResult) {
                inventoryArray.push(scrapeResult);
            }).parseInventory();
        });
        res.send(inventoryArray);
    }));
});

router.get('/all', function (req, res, next) {
    var dbConnection = new _dbOps.dbInterface("TBS_Store");
    dbConnection.get().then(function (resp) {
        var stores = resp;
        var PHA = 4111;
        var SNPA = 4112;
        var NHA = 4115;
        var beers = [PHA, SNPA, NHA];
        var labels = {
            4111: "PHA",
            4112: "SNPA",
            4115: "NHA"
        };
        var arr = [];

        var _loop = function _loop(i) {
            var store = stores[i];
            var aggr = {
                "store": store.location
            };
            _axios2.default.all(beers.map(function (id) {
                return _axios2.default.get('http://localhost:3000/api/tbs/inv/' + id + '/' + store.storeid, { data: { id: id } });
            })).then(_axios2.default.spread(function () {
                for (var _len2 = arguments.length, results = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    results[_key2] = arguments[_key2];
                }

                for (var n = 0; n < results.length; n++) {
                    aggr[JSON.parse(results[n].config.data).id] = results[i].data;
                }
                arr.push(aggr);
            }));
        };

        for (var i = 0; i < stores.length; i++) {
            _loop(i);
        }
    });
});

exports.default = router;
//# sourceMappingURL=tbs.js.map