
CREATE UNIQUE INDEX user_investments_investmentid_userid_idx ON user_investments (investment_id, created_by, paid_status);