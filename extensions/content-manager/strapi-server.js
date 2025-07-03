/**
 * Allows uid type to target 2nd level nested fields.
 *
 * ```json
 * {
 *   "slug": {
 *     "type": "uid",
 *     "targetField": "topSection.title"
 *   }
 * }
 * ```
 */
const makeGenerateUID = (baseFn) => async (ctx) => {
  const {
    contentTypeUID: _contentTypeUID,
    field: _field,
    data,
  } = ctx.request.body;

  const [contentTypeUID = _contentTypeUID, field = _field] = _field.split(".");

  return await baseFn({ contentTypeUID, field, data });
};

module.exports = (plugin) => {
  const { uid } = plugin.controllers;

  uid.generateUID = makeGenerateUID(uid.generateUID);

  return plugin;
};
