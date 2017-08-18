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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
var beerStore = 'http://www.thebeerstore.ca/beers/inventory';

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

exports.default = router;