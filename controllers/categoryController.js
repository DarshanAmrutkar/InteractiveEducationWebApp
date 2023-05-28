const Category = require("../models/Category");
const Note = require("../models/Note");

module.exports.list = (req, res) => {
  Category.find({ user: req.user.id })
    .then((category) => {
      res.json(category);
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.show = (req, res) => {
  const id = req.params.id;
  // Category.findById(id)
  //   .then((category) => {
  //     if (category) {
  //       res.json(category);
  //     } else {
  //       res.json({});
  //     }
  //   })
  //   .catch((err) => {
  //     res.json(err);
  //   });

  Promise.all([Category.findById(id), Note.find({ category: id })])
    .then((values) => {
      const [category, notes] = values;
      res.json({ category, notes });
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.create = (req, res) => {
  const body = req.body;
  const category = new Category({
    name: body.name,
    edit: body.edit,
    user: req.user.id
  });
  category
    .save()
    .then((category) => {
      res.json({
        notice: "successfully created a category",
        category
      });
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.destroy = (req, res) => {
  const id = req.params.id;
  Category.findByIdAndDelete(id)
    .then((category) => {
      if (category) {
        res.json(category);
      } else {
        res.json({});
      }
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.update = (req, res) => {
  const id = req.params.id;
  const body = req.body;
  Category.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .then((category) => {
      if (category) {
        res.json(category);
      } else {
        res.json({});
      }
    })
    .catch((err) => {
      res.json(err);
    });
};