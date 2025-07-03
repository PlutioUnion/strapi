"use strict";

const {
  templateTypeFromSlug,
  templateCategoryFromSlug,
  updateTemplateImages,
} = require("../../../helpers/template");

const uid = "api::template.template";

/**
 *  template controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

// Slugify title and get available slug
const getSlug = async (title, index = 0) => {
  // Convert title to slug and remove hanging dashes
  const slug =
    title
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+$/, "")
      .toLowerCase() + (index ? `-${index}` : "");

  const existingItem = await strapi.db
    .query(uid)
    .findOne({ select: ["id"], where: { slug } });

  if (existingItem) {
    return getSlug(title, index + 1);
  }

  return slug;
};

module.exports = createCoreController(uid, ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;

    await Promise.all([
      // Allow using slug to reference and use existing type.
      templateTypeFromSlug(data),

      // Allow using slug to reference and use existing category.
      templateCategoryFromSlug(data),
    ]);

    data.publishedAt = null;

    const imageUrls = data.images;
    delete data.images;

    data.slug = await getSlug(data.title);

    const response = await super.create(ctx);

    updateTemplateImages({
      ref_id: data.ref_id,
      data: { imageUrls },
    });

    return response;
  },

  async update(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.db
      .query(uid)
      .findOne({ select: ["id"], where: { ref_id: id } });

    if (!entity) return;

    ctx.params.id = entity.id;

    const { data } = ctx.request.body;

    await Promise.all([
      // Allow using slug to reference and use existing type.
      templateTypeFromSlug(data),

      // Allow using slug to reference and use existing category.
      templateCategoryFromSlug(data),
    ]);

    const imageUrls = data.images;
    delete data.images;

    const response = await super.update(ctx);

    updateTemplateImages({
      id: ctx.params.id,
      data: { imageUrls },
    });

    return response;
  },

  async delete(ctx) {
    const { id } = ctx.params;

    const entity = await strapi.db
      .query(uid)
      .findOne({ select: ["id"], where: { ref_id: id } });

    if (!entity) return;

    ctx.params.id = entity.id;

    return await super.delete(ctx);
  },
}));
