"use strict";

/**
 * compare service.
 */

const { createCoreService } = require("@strapi/strapi").factories;

module.exports = createCoreService("api::user-profile.user-profile");
