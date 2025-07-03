"use strict";

/**
 *  service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::template.template-category");
