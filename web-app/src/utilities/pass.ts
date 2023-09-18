import sha256 from 'crypto-js/sha256';
import API from '../services/API';
import moment from 'moment';
import crypto from 'crypto';
import iconv from 'iconv-lite';

export const getNiceToken = (data: {
  req_dtim: string;
  req_no: string;
  token_val: string;
  site_code: string;
  token_version_id: string;
}) => {
  const { req_dtim, req_no, token_val, site_code, token_version_id } = data;
  const dataString = req_dtim.trim() + req_no.trim() + token_val.trim();
  const hash = sha256(dataString);
  const hashDigest = hash.toString();

  const base64Digest = Buffer.from(hashDigest, 'hex').toString('base64');

  const result = {
    key: base64Digest.substring(0, 16),
    iv: base64Digest.substring(base64Digest.length - 16, base64Digest.length),
    hmac: base64Digest.substring(0, 32),
    site_code,
    token_version_id,
  };

  localStorage.setItem('niceKey', base64Digest.substring(0, 16));
  localStorage.setItem('niceIv', base64Digest.substring(base64Digest.length - 16, base64Digest.length));

  return result;
};

export const encrypt = (params: { key: string; iv: string; req_no: string; site_code: string; return_url: string }) => {
  const { iv, key, req_no, site_code, return_url } = params;

  const data = {
    requestno: req_no,
    sitecode: site_code,
    authtype: 'M', // 핸드폰
    returnurl: return_url,
    methodtype: 'get', // returnURL에 대한 메소드 타입 설정
    popupyn: 'Y',
  };

  localStorage.setItem('niceKey', key);
  localStorage.setItem('niceIv', iv);

  const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
  let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'base64');
  encrypted += cipher.final('base64');

  return encrypted;
};

export const getIntegrityValue = (data: { encData: string; hmac: string }) => {
  const { hmac, encData } = data;

  const cipher = crypto.createHmac('sha256', hmac);
  cipher.update(encData);
  const integrityValue = cipher.digest('base64');

  return integrityValue;
};

export const initializeNicePass = async (returnUrl: string) => {
  const {
    data: { access_token },
  } = await API.getNiceToken();

  const current_timestamp = moment().format('YYYYMMDDHHmmss');

  const cryptoBody = {
    req_dtim: `${current_timestamp}`,
    req_no: '1234567891',
    enc_mode: '1',
    access_token,
  };
  const {
    data: { dataBody: crypto },
  } = await API.getNiceCryptoToken(cryptoBody);

  const tokens = getNiceToken({
    ...crypto,
    req_dtim: cryptoBody.req_dtim,
    req_no: cryptoBody.req_no,
    enc_mode: cryptoBody.enc_mode,
  });

  const enc_data = encrypt({
    key: tokens.key,
    iv: tokens.iv,
    req_no: cryptoBody.req_no,
    site_code: tokens.site_code,
    return_url: returnUrl,
  });

  const token_version_id = tokens.token_version_id;

  const integrity_value = getIntegrityValue({
    encData: enc_data,
    hmac: tokens.hmac,
  });

  const result = {
    enc_data,
    token_version_id,
    integrity_value,
  };

  return result;
};

export const decrypt = (params: { token_version_id: string; enc_data: string; integrity_value: string }) => {
  const key = localStorage.getItem('niceKey') as string;
  const iv = localStorage.getItem('niceIv') as string;
  const { enc_data } = params;
  console.log('key', key);
  console.log('iv', iv);
  console.log('enc_data', enc_data);

  const decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
  let decrypted = decipher.update(enc_data, 'base64');
  const decryptBuffer = Buffer.concat([decrypted, decipher.final()]);

  const decodedDecrypted = iconv.decode(decryptBuffer, 'EUC-KR');

  return JSON.parse(decodedDecrypted);
};
