const { ValidationError } = require("@strapi/utils/lib/errors");
const fetch = require("node-fetch");
const uploadToLibrary = require("./uploader");

const templateTypeFromSlug = async (data) => {
  // Allow using slug to reference and use existing type.
  if (
    data.template_type &&
    !Number.isInteger(parseInt(data.template_type, 10))
  ) {
    const entry = await strapi.db.query("api::template.template-type").findOne({
      select: ["id"],
      where: { slug: data.template_type },
    });

    if (!entry) throw new ValidationError("template_type not found", data);

    data.template_type = entry.id;
  }
};

const templateCategoryFromSlug = async (data) => {
  // Allow using slug to reference and use existing category.
  if (
    data.template_categories &&
    data.template_categories.length &&
    data.template_categories.every(
      (cat) => !Number.isInteger(parseInt(cat, 10))
    )
  ) {
    const entries = await strapi.db
      .query("api::template.template-category")
      .findMany({
        select: ["id"],
        where: { slug: { $in: data.template_categories } },
      });

    if (entries.length !== data.template_categories.length)
      throw new ValidationError("template_categories not found", data);

    data.template_categories = entries;
  }
};

const templateStatusWebhook = async ({ status, templateLibraryId }) => {
  const baseUrl =
    process.env.NODE_ENV !== "development"
      ? "https://app.plutio.com"
      : "http://app.plutio.localhost:3000";

  const pathname = `/webhooks/templates-library/${templateLibraryId}/status` || '';

  const url = baseUrl + pathname;
  const opts = {
    method: "post",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      status,
    }),
  };
  await fetch(url, opts);
};

const updateTemplateImages = async ({ id, ref_id, data }) => {
  // Download image from the provided url,
  // upload to library and assign image ids
  if (data.imageUrls?.length) {
    const where = id ? { id } : { ref_id };

    const entry = await strapi.db.query("api::template.template").findOne({
      where,
      select: ["id"],
      populate: ["seo"],
    });

    if (!entry) return;

    const imagePromises = [];
    for (const imageUrl of data.imageUrls) {
      const imagePromise = uploadToLibrary({
        title: imagePromises.length + "image.png",
        url: imageUrl,
      });
      imagePromises.push(imagePromise);
    }

    const settled = await Promise.allSettled(imagePromises);
    const images = settled.reduce((prev, curr) => {
      if (curr.status === "fulfilled") prev.push(curr.value);
      return prev;
    }, []);

    const metaImage = images[0];
    const res = await Promise.allSettled[
      (strapi.db.query("api::template.template").update({
        where: { id: entry.id },
        data: { images },
      }),
      strapi.db.query("shared.seo").update({
        where: { id: entry.seo.id },
        data: { metaImage },
      }))
    ];
  }
};

module.exports = {
  templateTypeFromSlug,
  templateCategoryFromSlug,
  templateStatusWebhook,
  updateTemplateImages,
};
