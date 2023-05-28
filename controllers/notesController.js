const Note = require("../models/Note");

module.exports.list = (req, res) => {
  Note.find({ user: req.user.id }).populate("category")
    .then((note) => {
      res.json(note);
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.show = (req, res) => {
  const id = req.params.id;
  Note.findById(id)
    .populate("category")
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.json({});
      }
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.create = (req, res) => {
  console.log(req.user, "user");
  const body = req.body;
  const note = new Note({
    title: body.title,
    body: body.body,
    category: body.category,
    edit: body.edit,
    user: req.user.id
  });
  note
    .save()
    .then((note) => {
      res.json({
        notice: "successfully created a note",
        note
      });
    })
    .catch((err) => {
      res.json(err);
    });
};

module.exports.destroy = (req, res) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id)
    .then((note) => {
      if (note) {
        res.json(note);
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
  Note.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    .then((note) => {
      if (note) {
        res.json(note);
      } else {
        res.json({});
      }
    })
    .catch((err) => {
      res.json(err);
    });
};