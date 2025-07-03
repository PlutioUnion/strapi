const slugify = require("@sindresorhus/slugify");

module.exports = {
  beforeCreate(event) {
    const { data } = event.params;

    data.slug = slugify(data.title);
  },
};
