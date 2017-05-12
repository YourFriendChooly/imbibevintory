import cheerio from 'cheerio';

class beerStoreParser{
    constructor(html, response){
        this.callback = response;
        const ch = cheerio.load(html);
        this.$ = ch.bind(this);
    }

    parseInventory(){
        let item = this.$('.introduction').find('strong').text();
        let inventory = {};
        let count = 0;
        this.$('.brand-pricing').find('tbody').children().each((i, elem) => {
            //console.log("@ + " + this.$(elem).html());
            let size = this.$(elem).find('.size').text();
            count += parseInt(this.$(elem).find('.inventory').text());
            inventory["inv"] = count;
        });
        this.callback(inventory);
    }
}

export default beerStoreParser;