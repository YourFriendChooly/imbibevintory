'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.dbInterface = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var MongoClient = require('mongodb').MongoClient;

var dbInterface = exports.dbInterface = function () {
    function dbInterface(collection) {
        _classCallCheck(this, dbInterface);

        this.url = process.env.MONGO_DB;
        this.getConnection = this.getConnection.bind(this);
        this.collection = collection;
    }

    _createClass(dbInterface, [{
        key: 'getConnection',
        value: function getConnection() {
            var _this = this;

            return new Promise(function (resolve, reject) {
                MongoClient.connect(_this.url, function (err, db) {
                    if (err) {
                        console.log("Database Connection Failed");
                        reject(err);
                    } else {
                        console.log("Database Connection Successful");
                        resolve(db);
                    }
                });
            });
        }
    }, {
        key: 'get',
        value: function get() {
            var _this2 = this;

            return new Promise(function (resolve, reject) {
                _this2.getConnection().then(function (db) {
                    var c = db.collection(_this2.collection);
                    c.find({}).toArray(function (err, docs) {
                        if (err) {
                            reject(err);
                        } else {
                            db.close;
                            resolve(docs);
                        }
                    });
                });
            });
        }
    }, {
        key: 'add',
        value: function add(item) {
            var _this3 = this;

            this.getConnection().then(function (db) {
                var c = db.collection(_this3.collection);
                c.insertOne(item).then(function () {
                    db.close;
                });
            });
        }
    }, {
        key: 'remove',
        value: function remove(item) {
            this.getConnection(this.collection).then(function (db) {
                //TODO Remove
            });
        }
    }]);

    return dbInterface;
}();

var TBS_STORE = 'TBS_Store';
var test = new dbInterface(TBS_STORE);
test.get().then(function (result, err) {
    console.log(result);
});
//# sourceMappingURL=dbOps.js.map