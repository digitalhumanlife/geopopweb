import { isEmpty } from 'lodash';

export default class User {
  email_send_agree: any;
  sms_send_agree: any;
  file: any;
  bankbook: any;
  id_card: any;
  auth_document: any;
  register_certified: any;
  constructor(initData?: any) {
    if (initData) {
      Object.assign(this, initData);
    }
  }

  id: number = 0;
  email: string = '';
  token: string = '';
  role: string = '';
  createdAt: string = '';
  name: string = '';
  day: string = '';
  month: string = '';
  year: string = '';
  gender: string = '';
  phone1: string = '';
  phone2: string = '';
  phone3: string = '';
  ci: string = '';
  address: string = '';
  detailedAddress: string = '';
  type: string = '';
  business_number: string = '';
  account_num: string = '';
  bank_name: string = '';
  isLoggedIn(): boolean {
    return !isEmpty(this.token);
  }

  isAdmin(): boolean {
    return this.role === 'admin';
  }
}
