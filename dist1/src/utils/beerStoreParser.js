'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _cheerio = require('cheerio');

var _cheerio2 = _interopRequireDefault(_cheerio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var beerStoreParser = function () {
    function beerStoreParser(html, response) {
        _classCallCheck(this, beerStoreParser);

        this.callback = response;
        var ch = _cheerio2.default.load(html);
        this.$ = ch.bind(this);
    }

    _createClass(beerStoreParser, [{
        key: 'parseInventory',
        value: function parseInventory() {
            var _this = this;

            var item = this.$('.introduction').find('strong').text();
            var inventory = {};
            var count = 0;
            this.$('.brand-pricing').find('tbody').children().each(function (i, elem) {
                //console.log("@ + " + this.$(elem).html());
                var size = _this.$(elem).find('.size').text();
                count += parseInt(_this.$(elem).find('.inventory').text());
                inventory["inv"] = count;
            });
            this.callback(inventory);
        }
    }]);

    return beerStoreParser;
}();

exports.default = beerStoreParser;
//# sourceMappingURL=beerStoreParser.js.map