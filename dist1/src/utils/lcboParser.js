"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cheerio = require("cheerio");

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var lcboParser = function () {
    function lcboParser(html, params, responseHandler) {
        _classCallCheck(this, lcboParser);

        var dataAggregationType = {
            tel: function tel(entry, inv) {
                if (!inv) {
                    inv = {};
                }
                var phone = entry[entry.length - 2];
                inv[phone] = entry[entry.length - 1];
                return inv;
            },
            default: function _default(entry, inv) {
                if (!inv) {
                    inv = [];
                }
                var region = entry[0];
                var inventory = entry[entry.length - 1];
                var phone = entry[entry.length - 2];
                var address = entry.slice(1, entry.length - 2).join(", ");
                var obj = {
                    "region": region,
                    "inventory": inventory,
                    "address": address,
                    "phone": phone
                };
                inv.push(obj);
                return inv;
            },
            address: function address(entry, inv) {
                if (!inv) {
                    inv = {};
                }
                var address = entry.slice(1, entry.length - 2).join(", ");
                inv[address] = entry[entry.length - 1];
                return inv;
            },
            addressnomailing: function addressnomailing(entry, inv) {
                if (!inv) {
                    inv = {};
                }
                var address = entry[1];
                inv[address] = entry[entry.length - 1];
                return inv;
            }
        };

        this.callback = responseHandler;
        var ch = _cheerio2.default.load(html);
        this.$ = ch.bind(this);
        this.format = function () {
            if (!params.hasOwnProperty('returntype')) {
                return dataAggregationType.default.bind(this);
            } else if (dataAggregationType.hasOwnProperty(params.returntype)) {
                return dataAggregationType[params.returntype].bind(this);
            } else {
                responseHandler("Invalid Parameters for Return Type");
            }
        }();
    }

    _createClass(lcboParser, [{
        key: "parseInventory",
        value: function parseInventory() {
            var _this = this;

            var lcboTable = this.$('#storeInventory');
            var inv = null;
            lcboTable.find('tbody').find('tr').each(function (i, elem) {
                var entry = [];
                _this.$(elem).find('p').each(function (i, elem) {
                    var whatIfound = _this.$(elem).text();
                    whatIfound = whatIfound.replace(/[^\w][^\w][^\w]+/g, '');
                    if (whatIfound.match(/^[0-9]+$/)) {
                        entry.push(parseInt(whatIfound));
                    } else {
                        entry.push(whatIfound);
                    }
                });
                inv = _this.format(entry, inv);
            });
            this.callback(inv);
        }
    }]);

    return lcboParser;
}();

exports.default = lcboParser;
//# sourceMappingURL=lcboParser.js.map