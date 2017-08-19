import express from 'express'
import axios from 'axios';
import LcboParser from '../utils/lcboParser'

const router = express.Router();

const lcboInvUrl = 'http://www.lcbo.com/webapp/wcs/stores/servlet/ProductStoreInventoryView';

router.get('/inv/:brand', (req, res) => {
    console.log("Requested Brand Inventory");
    let partNumber = parseInt(req.params.brand);
    let params = req.query;
    let lcboInvParams = {
        "catalogId": 10001,
        "langId": -1,
        "partNumber": partNumber,
        "storeId": 10151,
        "ajax": true
    };
    axios.get(lcboInvUrl, {
        params: lcboInvParams,
        headers: {
            "cache-control": "no-cache",
            "upgrade-insecure-requests": "1",
            "DNT": "1",
            "Host": "www.lcbo.com",
            "X-Requested-With": "XMLHttpRequest",
            "Connection": "keep-alive"
        }
    }).then((resp) => {
        let result = new LcboParser(resp.data, params, (parsed) => {
            res.send(parsed);
        });
        result.parseInventory();
    }).catch((err) => {
        res.send(err);
    })
});

export default router;
