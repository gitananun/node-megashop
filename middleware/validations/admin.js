const { body } = require('express-validator');

module.exports = {
  'add-product': [
    body('title', 'Title must be alphanumeric and with the length of minimum 3')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl', 'Invalid URL').isURL(),
    body('price', 'Invalid float number').isFloat(),
    body(
      'description',
      'Description have to have at least 3 characters and maximum 255'
    )
      .isLength({ min: 3, max: 255 })
      .trim(),
  ],
  'edit-product': [
    body('title', 'Title must be alphanumeric and with the length of minimum 3')
      .isString()
      .isLength({ min: 3 })
      .trim(),
    body('imageUrl', 'Invalid URL').isURL(),
    body('price', 'Invalid float number').isFloat(),
    body(
      'description',
      'Description have to have at least 3 characters and maximum 255'
    )
      .isLength({ min: 3, max: 255 })
      .trim(),
  ],
};
