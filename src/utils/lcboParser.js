import cheerio from 'cheerio';

class lcboParser{
    constructor(html, params, responseHandler){
        const dataAggregationType = {
            tel: function (entry, inv) {
                if (!inv){
                    inv = {};
                }
                let phone = entry[entry.length-2];
                inv[phone] = entry[entry.length - 1];
                return inv;
            },
            default: function (entry, inv) {
                if (!inv){
                    inv = [];
                }
                let region = entry[0];
                let inventory = entry[entry.length-1];
                let phone = entry[entry.length-2];
                let address = entry.slice(1, entry.length-2).join(", ");
                let obj = {
                    "region": region,
                    "inventory": inventory,
                    "address": address,
                    "phone": phone
                };
                inv.push(obj);
                return inv;
            },
            address: function (entry, inv) {
                if (!inv){
                    inv = {};
                }
                let address = entry.slice(1, entry.length-2).join(", ");
                inv[address] = entry[entry.length - 1];
                return inv;
            },
            addressnomailing: function (entry, inv) {
                if (!inv){
                    inv = {};
                }
                let address = entry[1];
                inv[address] = entry[entry.length - 1];
                return inv;
            }
        };

        this.callback = responseHandler;
        const ch = cheerio.load(html);
        this.$ = ch.bind(this);
        this.format = function(){
            if (!params.hasOwnProperty('returntype')){
                return dataAggregationType.default.bind(this);
            } else if (dataAggregationType.hasOwnProperty(params.returntype)){
                return dataAggregationType[params.returntype].bind(this);
            } else {
                responseHandler("Invalid Parameters for Return Type");
            }
        }();
    }

    parseInventory(){
        let lcboTable = this.$('#storeInventory');
        let inv = null;
        lcboTable.find('tbody').find('tr').each((i,elem) => {
            let entry = [];
            this.$(elem).find('p').each((i, elem) => {
                let whatIfound = this.$(elem).text();
                whatIfound = whatIfound.replace(/[^\w][^\w][^\w]+/g, '');
                if (whatIfound.match(/^[0-9]+$/)){
                    entry.push(parseInt(whatIfound));
                } else {
                    entry.push(whatIfound);
                }
            });
            inv = this.format(entry, inv);
        });
        this.callback(inv);
    }
}

export default lcboParser;