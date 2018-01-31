const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
//  res.send('Hey! It works!');
//  const amir = { name: "amir", age: 12};
//  res.json(amir);
	res.render('hello', { title: "Home page" })
});

// router.get('/reverse/:name', (req, res) => {
//   const reverse = [...req.params.name].reverse().join('')
//   res.send(reverse);
// });

module.exports = router;
