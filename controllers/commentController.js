let controller = {};
let models = require('../models');
let Squelize = require('sequelize');
let Op = Squelize.Op;
let Comment = models.Comment

controller.add = (comment) => {
	return new Promise((resolve, reject)=>{
    Comment.create(comment)
    .then(data => resolve(data))
    .catch(error => reject(new Error(error)));
  })
};

module.exports = controller;
