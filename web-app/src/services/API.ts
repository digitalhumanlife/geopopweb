import axios from 'axios';

async function getPolygonContainPoint(lat: number, lng: number, sync: string = 'f') {
  const { data } = await axios.get('/ground/polygon-contain-point', {
    params: {
      lat,
      lng,
      sync,
    },
  });
  return data;
}

async function getGroundById(id: string) {
  const { data } = await axios.get(`/ground/ground-by-id/${id}`);
  return data;
}

async function getSupportedPolygons() {
  const { data } = await axios.get('/ground');
  return data;
}

async function searchGrounds(payload: any) {
  const { data } = await axios.get('/ground/public/search', {
    params: payload,
  });
  return data;
}

async function countSearchingGrounds(payload: any) {
  const { data } = await axios.get('/ground/public/search/count', {
    params: payload,
  });
  return data;
}

async function searchExternal(q: string) {
  const { data } = await axios.get('/ground/search-ex', {
    params: { q },
  });
  return data;
}

async function getUsers() {
  const { data } = await axios.get('/admin/users');
  return data;
}

async function createOrUpdateUser(payload: any) {
  const { data } = await axios.post('/admin/users', payload);
  return data;
}

async function removeUser(id: any) {
  const { data } = await axios.delete(`/user/${id}`);
  return data;
}

async function getAllAgencyProps() {
  const { data } = await axios.get('/ground/agencies/public');
  return data;
}

async function getOwnedAgencyProps() {
  const { data } = await axios.get('/ground/agencies');
  return data;
}

async function getAgencyPropsByUniqueNum(uniqueNum: any) {
  const { data } = await axios.get(`/ground/agencies/${uniqueNum}`);
  return data;
}

async function upsertGroundAgencyProps(payload: any) {
  const { data } = await axios.post('/ground/agencies', payload);
  return data;
}

async function deleteGroundAgency(groundUniqueNum: any) {
  const { data } = await axios.delete(`/ground/agencies/${groundUniqueNum}`);
  return data;
}

async function getAdminActivities() {
  const { data } = await axios.get(`/admin/audit-logs`);
  return data;
}

async function getGroundsNearPoint(lat: number, lng: number, uniqueNum: string) {
  const { data } = await axios.get('/ground/grounds-near-point', {
    params: {
      lat,
      lng,
      uniqueNum,
    },
  });
  return data;
}

async function getPlacesNearBy(type: string, lat: number, lng: number, fromDistance: number, toDistance: number) {
  const { data } = await axios.get(`/ground/nearby/${type}`, {
    params: {
      lat,
      lng,
      fromDistance,
      toDistance,
    },
  });
  return data;
}

async function searchRegion(place: string, search: string) {
  const { data } = await axios.get('/ground/region', {
    params: {
      place,
      type: 'municipality',
      search,
    },
  });
  return data;
}

async function getPlacesByRegion(type: string, region: string, mapBounds: any) {
  const { data } = await axios.get(`/ground/region/${type}`, {
    params: {
      region,
      lngMin: mapBounds.ha,
      latMin: mapBounds.qa,
      lngMax: mapBounds.oa,
      latMax: mapBounds.pa,
    },
  });
  return data;
}

async function getDistrict(selected: string, sido: string, sigungu: string, dong: string) {
  const { data } = await axios.get('/place/district', {
    params: {
      selected,
      sido,
      sigungu,
      dong,
    },
  });
  return data;
}

async function getRenovationSearchData(body: any) {
  const { data } = await axios.post('/ground/renovation', body);
  return data;
}

async function fetchGroundPrices() {
  const { data } = await axios.get('/ground/ground-prices');
  return data;
}

async function uploadDocuments(body: any) {
  const formData = new FormData();
  formData.append('doc1', body.doc1);
  formData.append('doc2', body.doc2);
  formData.append('doc3', body.doc3);
  formData.append('doc4', body.doc4);
  formData.append('amount', body.amount);
  formData.append('purpose', body.purpose);
  formData.append('term', body.term);
  formData.append('groundAddress', body.groundAddress);
  formData.append('uniqueNum', body.uniqueNum);
  formData.append('firstName', body.firstName);
  formData.append('lastName', body.lastName);
  formData.append('gender', body.gender);
  formData.append('maritalStatus', body.maritalStatus);
  formData.append('dependants', body.dependants);
  formData.append('birthday', body.birthday);
  formData.append('email', body.email);
  formData.append('phone', body.phone);
  formData.append('address', body.address);
  formData.append('employmentStatus', body.employmentStatus);
  formData.append('employmentYear', body.employmentYear);
  formData.append('employmentMonth', body.employmentMonth);
  formData.append('employmentPay', body.employmentPay);
  formData.append('employmentIndustry', body.employmentIndustry);
  formData.append('employerName', body.employerName);
  formData.append('netIncome', body.netIncome);
  formData.append('rentalPayments', body.rentalPayments);
  formData.append('monthlyLoan', body.monthlyLoan);
  formData.append('otherExpenses', body.otherExpenses);
  const reqConfig = {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  };
  const { data } = await axios.post('/document/upload', formData, reqConfig);
  return data;
}

async function getP2PRequest() {
  const { data } = await axios.get('/document/list');
  return data;
}

async function updateP2PStatus(id: any, status: any) {
  const { data } = await axios.put(`/document/updateStatus/${id}/${status}`);
  return data;
}
async function getRequest(id: string) {
  const { data } = await axios.get(`/document/request/${id}`);
  return data;
}

async function getQnAs() {
  const { data } = await axios.get(`/support/`);
  return data;
}

async function saveQnA(payload: any) {
  const { data } = await axios.post(`/support/`, payload);
  return data;
}

//전체 상품 리스트
async function getInvestments() {
  const { data } = await axios.get(`/investments`);
  return data;
}

async function getBanners() {
  const { data } = await axios.get(`/banner`);
  return data.data;
}

async function saveInvestment(payload: any) {
  const { data } = await axios.post(`/investments/`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

//특정 상품 리스트
async function getInvestment(id: string) {
  const { data } = await axios.get(`/investments/`, {
    params: {
      id: id,
    },
  });
  return data;
}

async function completeInvestment(id: string, complete: boolean) {
  const { data } = await axios.post(`/investments/${id}/recruitment/complete`, { recruitment_complete: complete });
  return data;
}

async function removeInvestment(id: string) {
  const { data } = await axios.delete(`/investments/${id}`);
  return data;
}

async function getBankInformation(id: string) {
  const { data } = await axios.get(`/investments/${id}/banking`);
  return data;
}

//나의 프로젝트
async function getBought() {
  const { data } = await axios.get(`/user-invest/`);
  return data;
}

async function saveBought(payload: any) {
  const { data } = await axios.post(`/user-invest`, payload);
  return data;
}

async function getPrice(id: any) {
  const { data } = await axios.get(`/user-invest/price?investment_id=${id}`);
  return data;
}

async function getBookmarks() {
  const { data } = await axios.get(`/bookmarks/`);
  return data;
}

async function saveBookmark(payload: any) {
  const { data } = await axios.post(`/bookmarks/`, payload);
  return data;
}

async function getNotices() {
  const { data } = await axios.get(`/notices/`);
  return data;
}

async function getNotice(id: string) {
  const { data } = await axios.get(`/notices/`, {
    params: { id: id },
  });
  return data;
}

async function saveNotice(payload: any) {
  const { data } = await axios.post(`/notices/`, payload);
  return data;
}

async function saveInvestNotice(payload: any) {
  const { data } = await axios.post(`/notices/investment`, payload);
  return data;
}

async function removeNotice(id: any) {
  const { data } = await axios.delete(`/notices/${id}`);
  return data;
}

async function getNotification(id: string) {
  const { data } = await axios.get(`/notification`, {
    params: { investment_id: id },
  });
  return data;
}

async function postNotification(payload: any) {
  const { data } = await axios.post(`/notification/`, payload);
  return data;
}

async function deleteNotification(id: any) {
  const { data } = await axios.delete(`/notification/${id}`);
  return data;
}

async function getUserGuides() {
  const { data } = await axios.get(`/user-guides/`);
  return data;
}

async function getUserGuide(id: string) {
  const { data } = await axios.get(`/user-guides/`, {
    params: { id: id },
  });
  return data;
}

async function saveUserGuide(payload: any) {
  const { data } = await axios.post(`/user-guides/`, payload);
  return data;
}

async function removeUserGuide(id: any) {
  const { data } = await axios.delete(`/user-guides/${id}`);
  return data;
}

async function getAllBought() {
  const { data } = await axios.get(`/admin/bought/`);
  return data;
}

async function getBoughtById(id: any) {
  const { data } = await axios.get(`/admin/bought/${id}`);
  return data;
}

async function confirmPaidInvestment(id: any) {
  const { data } = await axios.put(`/admin/investment-paid/${id}`, { paid: true });
  return data;
}

async function getVote(id: any) {
  const { data } = await axios.get(`/vote/vote/`, {
    params: { id: id },
  });
  return data;
}

//상품 투표정보 API
async function getVotes(id: any) {
  const { data } = await axios.get(`/vote/votes/`, {
    params: { investment_id: id },
  });
  return data;
}

async function saveVote(payload: any) {
  const { data } = await axios.post(`/vote/vote/`, payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return data;
}

async function removeVote(id: any) {
  const { data } = await axios.delete(`/vote/vote`, {
    params: { id: id },
  });
  return data;
}

async function getVoteRecord(id: any) {
  const { data } = await axios.get(`/vote/vote-record`, {
    params: { id: id },
  });
  return data;
}

async function saveVoteRecord(payload: any) {
  const { data } = await axios.post(`/vote/vote-record/`, payload);
  return data;
}

async function updateVoteStatus(payload: any) {
  const { data } = await axios.post(`/vote/vote-status/`, payload);
  return data;
}

//투표 결과 출력 API
async function getVoteResult(investment_id: string, vote_id: string, masked: boolean) {
  const { data } = await axios.get(`/vote/result`, {
    params: { investment_id, vote_id, masked },
  });
  return data;
}

async function getProductVoteResult(investment_id: number) {
  const { data } = await axios.get(`/result`, {
    params: { investment_id },
  });
  return data;
}

async function getNiceToken() {
  const { data } = await axios.get(`/nice/token`);
  return data;
}

async function getNiceCryptoToken(body: any) {
  const { data } = await axios.post(`/nice/crypto`, body);

  return data;
}

async function sendQnaEmail(payload: any) {
  const { data } = await axios.post(`/support/inquiry/my`, payload);
  return data;
}

export default {
  getPolygonContainPoint,
  getGroundById,
  getSupportedPolygons,
  searchGrounds,
  searchExternal,
  countSearchingGrounds,
  getUsers,
  createOrUpdateUser,
  removeUser,
  getAllAgencyProps,
  getOwnedAgencyProps,
  getAgencyPropsByUniqueNum,
  upsertGroundAgencyProps,
  deleteGroundAgency,
  getAdminActivities,
  getGroundsNearPoint,
  getPlacesNearBy,
  searchRegion,
  getPlacesByRegion,
  getDistrict,
  getRenovationSearchData,
  fetchGroundPrices,
  uploadDocuments,
  getP2PRequest,
  updateP2PStatus,
  getRequest,
  getQnAs,
  saveQnA,
  getBought,
  saveBought,
  getPrice,
  getInvestments,
  getBanners,
  saveInvestment,
  getInvestment,
  removeInvestment,
  completeInvestment,
  getBankInformation,
  getBookmarks,
  saveBookmark,
  getNotices,
  getNotice,
  saveNotice,
  saveInvestNotice,
  removeNotice,
  getNotification,
  postNotification,
  deleteNotification,
  getUserGuides,
  getUserGuide,
  saveUserGuide,
  removeUserGuide,
  getAllBought,
  getBoughtById,
  confirmPaidInvestment,
  getVote,
  getVotes,
  saveVote,
  getVoteRecord,
  saveVoteRecord,
  removeVote,
  getVoteResult,
  getProductVoteResult,
  getNiceToken,
  getNiceCryptoToken,
  sendQnaEmail,
  updateVoteStatus,
};
