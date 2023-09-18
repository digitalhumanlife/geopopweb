const { select, insert, remove } = require('../db/queries');
const CONSTANT = require('../utils/constant');

async function getBookmarks(user) {
  const bookmarks = await select(CONSTANT.TABLE.BOOKMARKS, { user_id: { value: user.id } }, [], 'id DESC');

  const result = [];
  for (let i = 0; i < bookmarks.length; i++) {
    const investments = await select(
      CONSTANT.TABLE.INVESTMENTS,
      { id: { value: bookmarks[i].investment_id }, disabled_at: { value: null } },
      [],
      '',
    );
    if (investments.length > 0) {
      result.push(investments[0]);
    }
  }
  return result;
}

async function saveBookmark(user, payload) {
  const investments = await select(CONSTANT.TABLE.INVESTMENTS, { id: { value: payload.investment_id } }, [], '');
  if (investments.length === 0) {
    throw new Error('Not found');
  }
  const bookmarks = await select(
    CONSTANT.TABLE.BOOKMARKS,
    { user_id: { value: user.id }, investment_id: { value: payload.investment_id } },
    [],
    '',
  );
  if (bookmarks.length > 0) {
    await remove(CONSTANT.TABLE.BOOKMARKS, { id: bookmarks[0].id });
  } else {
    await insert(CONSTANT.TABLE.BOOKMARKS, {
      user_id: user.id,
      investment_id: payload.investment_id,
      created_at: new Date(),
    });
  }
}

async function removeBookmark(user, id) {
  await remove(CONSTANT.TABLE.BOOKMARKS, { user_id: user.id, id: id });
}

module.exports = {
  getBookmarks,
  saveBookmark,
  removeBookmark,
};
