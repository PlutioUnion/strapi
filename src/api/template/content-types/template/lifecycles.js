const { templateStatusWebhook } = require("../../../../helpers/template");

module.exports = {
  async beforeUpdate(event) {
    const { data, where } = event.params;

    // no manual update of `approved`
    delete data.status;

    const old = await strapi.entityService.findOne(
      "api::template.template",
      where.id,
      { fields: ["status", "ref_id"] }
    );

    if (data.publishedAt && old.status === "pending") {
      data.ref_id = old.ref_id;
      data.status = "approved";
    }
  },

  async afterUpdate(event) {
    const { data } = event.params;

    if (data.status === "approved") {
      templateStatusWebhook({
        status: "approved",
        templateLibraryId: data.ref_id,
      }).catch(console.log);
    }
  },

  async beforeDelete(event) {
    const { params } = event;

    const old = await strapi.entityService.findOne(
      "api::template.template",
      params.where.id,
      { fields: ["status", "ref_id"] }
    );

    event.state.old = old;
  },

  async afterDelete(event) {
    templateStatusWebhook({
      status: "rejected",
      templateLibraryId: event.state.old.ref_id,
    }).catch(console.log);
  },
};
