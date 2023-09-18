interface IInvestmentItem {
  created_at: Date;
  created_by: number;
  current_invest: number;
  end_date: Date;
  id: number;
  invest_id: string;
  invest_time: string;
  max_invest: number;
  profit: number;
  recruitment_amount: number;
  start_date: Date;
  status: string;
  title: string;
  won_per_account: number;
  thumbnail1: string;
  thumbnail2: string;
  thumbnail3: string;
  business_information?: any;
  recruitment_complete: boolean;
  business_type: string;
}

interface IUserInvestMentItem {
  amount: string;
  created_at: Date;
  end_date: Date;
  document1: string;
  document2: string;
  document3: string;
  document4: string;
  document5: string;
  document1_org: string;
  document2_org: string;
  document3_org: string;
  document4_org: string;
  document5_org: string;
  document: { fileUrl: string; fileName: string }[];
  id: number;
  invest_id: string;
  investment_id: string;
  notices: [];
  paid_status: string;
  process_percent: number;
  status: string;
  title: string;
  vote: any[];
  title_21: string;
  title_22: string;
  voteAndNotices: any[];
  curTab: string;
  total_invest_user_count: number;
  max_invest: string;
  userInvestment?: any[];
  business_type: string;
}

export type { IInvestmentItem, IUserInvestMentItem };
