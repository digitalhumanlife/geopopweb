const { select, insert, remove, update } = require('../db/queries');
const CONSTANT = require('../utils/constant');

async function getUserGuides(id) {
  let query = {};
  if (id !== '') {
    query = { id: { value: id } };
  }
  const userGuides = await select(CONSTANT.TABLE.USER_GUIDES, query, [], 'id DESC');
  return userGuides;
}

async function saveUserGuide(user, payload) {
  if (!payload.id) {
    payload.created_by = user.id;
    payload.created_at = new Date();
    await insert(CONSTANT.TABLE.USER_GUIDES, payload);
  } else {
    await update(CONSTANT.TABLE.USER_GUIDES, payload, { id: payload.id });
  }
}

async function removeUserGuide(id) {
  await remove(CONSTANT.TABLE.USER_GUIDES, { id: id });
}

module.exports = {
  saveUserGuide,
  getUserGuides,
  removeUserGuide,
};
