export interface AlarmType {
  created_at: Date;
  disabled_at: Date;
  id: number;
  investment_id: number;
  to_target: string;
  type: string;
  user_id: number;
}
