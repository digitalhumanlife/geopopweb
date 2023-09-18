const { select, insert, remove, update } = require('../db/queries');
const CONSTANT = require('../utils/constant');

async function getBanners() {
  return await select(CONSTANT.TABLE.BANNER, {}, [], 'priority ASC');
}

async function saveBanner(payload) {
  if (!payload.id) {
    payload.created_at = new Date();
    await insert(CONSTANT.TABLE.BANNER, payload);
  } else {
    payload.updated_at = new Date();
    await update(CONSTANT.TABLE.BANNER, payload, { id: payload.id });
  }
}

// async function saveBanners(payload) {
//
//   if (payload.banners) {
//     for (const banner in payload.banners) {
//       if (!banner.id) {
//         await insert(CONSTANT.TABLE.BANNER, banner);
//       } else {
//         banner.updated_at = new Date();
//         await update(CONSTANT.TABLE.BANNER, banner, {id: banner.id});
//       }
//     }
//   }
// }

async function updatePriority(payload) {
  for (const banner of payload) {
    await update(CONSTANT.TABLE.BANNER, { priority: banner.priority }, { id: banner.id });
  }
}

async function removeBanner(id) {
  await remove(CONSTANT.TABLE.BANNER, { id: id });
}

module.exports = {
  getBanners,
  saveBanner,
  // saveBanners,
  updatePriority,
  removeBanner,
};
