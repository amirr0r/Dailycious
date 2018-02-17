const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController')

const { catchErrors } = require('../handlers/errorHandlers')

router.get('/', catchErrors(storeController.getStores));
router.get('/stores', catchErrors(storeController.getStores));

router.get('/add', storeController.addStore);
router.post('/add', 
	storeController.upload, storeController.resize, 
	catchErrors(storeController.createStore)
);
router.post('/add/:id', 
	storeController.upload, storeController.resize, 
	catchErrors(storeController.updateStore)
);

router.get('/stores/:id/edit', catchErrors(storeController.editStore));
router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));

router.get('/tag/', catchErrors(storeController.getStoresByTag));
router.get('/tag/:tag', catchErrors(storeController.getStoresByTag));

module.exports = router;
