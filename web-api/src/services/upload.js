const { pool } = require('../db/queries');

async function uploadDocuments(files, payload) {
  const price = await getTransactionPrice(payload.uniqueNum);
  let status = price > payload.amount ? 'approved' : 'pending';
  const res = await insertP2PRequest(files, payload, status);
  return res;
}

function insertP2PRequest(files, payload, status) {
  return new Promise((resolve, reject) => {
    const doc1 = files.doc1;
    const doc2 = files.doc2;
    const doc3 = files.doc3;
    const doc4 = files.doc4;
    const data = JSON.stringify({
      ...payload,
      birthday: new Date(payload.birthday).getTime(),
      doc1: doc1.name,
      doc2: doc2.name,
      doc3: doc3.name,
      doc4: doc4.name,
    });
    pool.query(
      `INSERT INTO p2p_request(data, status) VALUES($1, $2) RETURNING id`,
      [data, status],
      (error, results) => {
        if (error) {
          console.log(error);
          return reject(error);
        }
        const id = results.rows[0].id;
        doc1.mv(`./uploads/${id}/doc1/` + doc1.name);
        doc1.mv(`./uploads/${id}/doc2/` + doc2.name);
        doc1.mv(`./uploads/${id}/doc3/` + doc3.name);
        doc1.mv(`./uploads/${id}/doc4/` + doc4.name);
        resolve(id);
      },
    );
  });
}

function getTransactionPrice(uniqueNum) {
  return new Promise((resolve, reject) => {
    pool.query('SELECT transaction_price FROM ground_new WHERE unique_num=$1', [uniqueNum], (error, results) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(results.rows[0].transaction_price);
    });
  });
}

async function getDocuments() {
  const requests = await getRequests();
  for (let i = 0; i < requests.length; i++) {
    requests[i].data = JSON.parse(requests[i].data);
    const price = await getTransactionPrice(requests[i].data.uniqueNum);
    requests[i].data.price = price;
  }
  return requests;
}

function getRequests() {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM p2p_request', [], (error, results) => {
      if (error) {
        console.log(error);
        return reject(error);
      }
      resolve(results.rows);
    });
  });
}

async function getDocument(id) {
  const request = await getRequest(id);
  request.data = JSON.parse(request.data);
  const price = await getTransactionPrice(request.data.uniqueNum);
  request.data.price = price;
  return request;
}

function getRequest(id) {
  return new Promise((resolve, reject) => {
    pool.query('SELECT * FROM p2p_request WHERE id=$1', [id], (error, results) => {
      if (error) {
        console.log(error);
        reject(error);
      }
      if (results.rows.length > 0) {
        resolve(results.rows[0]);
      } else {
        reject(null);
      }
    });
  });
}

function updateStatus(id, status) {
  return new Promise((resolve, reject) => {
    pool.query('UPDATE p2p_request SET status=$1 WHERE id=$2', [status, id], error => {
      if (error) {
        console.log(error);
        reject(error);
      }
      resolve();
    });
  });
}

module.exports = { uploadDocuments, getDocuments, updateStatus, getDocument };
