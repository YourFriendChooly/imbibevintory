import express from 'express'
import axios from 'axios'
import beerStoreParser from '../utils/beerStoreParser'

const router = express.Router();
const beerStore = 'http://www.thebeerstore.ca/beers/inventory';

router.get('/inv/:store/:brand', (req, res, next) => {
    axios.get(`${beerStore}/${req.params.brand}/${req.params.store}`)
        .then((resp => {
            let bsParse = new beerStoreParser(resp.data, (results) => {
                res.send(results);
            });
            bsParse.parseInventory();
        }))
});

router.get('/inv/:store', (req, res, next) => {
    const beerIDs = {
        4111: "PHA",
        4112: "SNPA",
        4115: "NHA"
    };
    let inventoryArray = [];
    let beerId = 0;
    axios.all(Object.keys(beerIDs).map((id) => {
        return axios.get(`${beerStore}/${id}/${req.params.store}`)
    })).then(axios.spread((...inventory) => {
        inventory.map((responseObject) => {
            new beerStoreParser(responseObject.data, (scrapeResult) =>{
                inventoryArray.push(scrapeResult);
            }).parseInventory();
        });
        res.send(inventoryArray);
    }))
});

export default router;
