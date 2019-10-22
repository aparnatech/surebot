const router = require('express').Router();
const cors = require('cors');
const User = require('../models/User');
const MenuData = require('../models/menu');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const keys = require('../config/key');
router.use(cors());

// getting the api
router.get('/get', (req, res) => {
  MenuData.find()
    .then(data => res.json(data))
    .catch(err => res.status(400).json('Error: ' + err));
});

// sign up api
router.post('/signup', (req, res) => {
  const userdata = {
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    created: new Date()
  };
  if (!userdata.name || !userdata.email || !userdata.password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  User.findOne({
    email: userdata.email
  })
    .then(user => {
      if (user) {
        return res.status(409).json({
          message: 'Mail exist'
        });
      } else {
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(userdata.password, salt, (err, hash) => {
            if (err) {
              throw err;
            }
            userdata.password = hash;
            User.create(userdata)
              .then(user =>
                jwt.sign(
                  { id: user._id },
                  keys.secretOrKey,
                  {
                    expiresIn: 3600
                  },
                  (err, token) => {
                    if (err) throw err;
                    res.json({
                      success: true,
                      token: token,
                      user: {
                        _id: user.id,
                        name: user.name,
                        email: user.email
                      }
                    });
                  }
                )
              )
              .catch(err => res.send(err));
          });
        });
      }
    })
    .catch(err => {
      res.send('user already taken');
    });
});

// login api
router.post('/login', (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ msg: 'Please enter all fields' });
  }

  User.findOne({
    email: req.body.email
  })
    .then(user => {
      console.log(user);
      if (user) {
        console.log(user);
        bcrypt.compare(req.body.password, user.password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: 'password does not match'
            });
          }
          if (result) {
            const payload = {
              _id: user._id,
              name: user.name,
              email: user.email
            };
            const token = jwt.sign(payload, keys.secretOrKey, {
              expiresIn: '1h'
            });
            return res.status(200).json({
              message: 'Authorazation successfull',
              token: token
            });
          }
          res.status(401).json({
            message: 'Authorazation failed'
          });
        });
      } else {
        res.status(401).json({
          error: 'user does not exist'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//insert the menuDetail
router.post('/insert', (req, res) => {
  const dishName = req.body.dishName;
  const image = req.body.image;
  const price = req.body.price;
  const description = req.body.description;

  const menuData = new MenuData({ image, description, dishName, price });
  menuData
    .save()
    .then(response => res.json(response))
    .catch(err => console.log('err', err));
});

// update menu
router.post('/updating/:id', function(req, res) {
  const dishName = req.body.dishName;
  const image = req.body.image;
  const title = req.body.title;
  const price = req.body.price;
  const description = req.body.description;
  const id = req.body.id;

  menuData
    .findOneAndUpdate({ _id: id }, { $set: { description: description, title: title, image: image, dishName: dishName, price: price } })
    .exec(function(err, data) {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(200).send(data);
      }
    });
});

// Delete menu
router.delete('/delete/:id', (req, res) => {
  menuData.findByIdAndDelete(req.params.id).then(users => res.json(users));
});

module.exports = router;
