import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import './EvidenceData.scss';

export interface EvidenceDataProps
  extends RouteComponentProps<{
    id: string;
    invest_id: string;
    masked: string;
  }> {}

export default function VoteResult(props: EvidenceDataProps) {
  return (
    <div className="evidence-data">
      <div className="evidence-data__head">
        <div className="sbj">*프로젝트 참여 증빙자료</div>
        <div className="tt">프로젝트명 : {`테스트 프로젝트`}</div>
        <div className="code">코드 : [{`000000`}]</div>
      </div>

      <div className="evidence-data__table">
        <table>
          <colgroup>
            <col style={{ width: '7%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '29%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>
                <span className="order">No</span>
              </th>
              <th>이름</th>
              <th>생년월일</th>
              <th colSpan={7}>주소</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan={5}>10</td>
              <td rowSpan={5}>이르음</td>
              <td>1000-03-33</td>
              <td colSpan={7}>주소 위치 </td>
            </tr>
            <tr>
              <th>연락처</th>
              <th>좌수</th>
              <th>안건1</th>
              <th>안건2</th>
              <th>안건3</th>
              <th>안건4</th>
              <th>안건5</th>
              <th>동의서</th>
            </tr>
            <tr>
              <td>010-1111-1111</td>
              <td>10</td>
              <td>찬</td>
              <td>찬</td>
              <td>찬</td>
              <td>찬</td>
              <td>찬</td>
              <td>○</td>
            </tr>
            <tr>
              <th>개인정보수집</th>
              <th colSpan={3}>은행명</th>
              <th colSpan={4}>계좌번호</th>
            </tr>
            <tr>
              <td>○</td>
              <td colSpan={3}>농협</td>
              <td colSpan={4}>123-1111-111-11</td>
            </tr>
          </tbody>
        </table>
        <table>
          <colgroup>
            <col style={{ width: '7%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '29%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>
                <span className="order">No</span>
              </th>
              <th>이름</th>
              <th>생년월일</th>
              <th colSpan={7}>주소</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan={5}>10</td>
              <td rowSpan={5}>이르음</td>
              <td>1000-03-33</td>
              <td colSpan={7} className="align-left">
                주소 위치{' '}
              </td>
            </tr>
            <tr>
              <th>연락처</th>
              <th>좌수</th>
              <th>안건1</th>
              <th>안건2</th>
              <th>안건3</th>
              <th>안건4</th>
              <th>안건5</th>
              <th>동의서</th>
            </tr>
            <tr>
              <td>010-1111-1111</td>
              <td>10</td>
              <td>찬</td>
              <td>찬</td>
              <td>찬</td>
              <td>찬</td>
              <td>찬</td>
              <td>○</td>
            </tr>
            <tr>
              <th>개인정보수집</th>
              <th colSpan={3}>은행명</th>
              <th colSpan={4}>계좌번호</th>
            </tr>
            <tr>
              <td>○</td>
              <td colSpan={3}>농협</td>
              <td colSpan={4}>123-1111-111-11</td>
            </tr>
          </tbody>
        </table>
        <table>
          <colgroup>
            <col style={{ width: '7%' }} />
            <col style={{ width: '15%' }} />
            <col style={{ width: '29%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
            <col style={{ width: '7%' }} />
          </colgroup>
          <thead>
            <tr>
              <th>
                <span className="order">No</span>
              </th>
              <th>이름</th>
              <th>생년월일</th>
              <th colSpan={7}>주소</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td rowSpan={5}>10</td>
              <td rowSpan={5}>이르음</td>
              <td>1000-03-33</td>
              <td colSpan={7} className="align-left">
                주소 위치{' '}
              </td>
            </tr>
            <tr>
              <th>연락처</th>
              <th>좌수</th>
              <th>안건1</th>
              <th>안건2</th>
              <th>안건3</th>
              <th>안건4</th>
              <th>안건5</th>
              <th>동의서</th>
            </tr>
            <tr>
              <td>010-1111-1111</td>
              <td>10</td>
              <td>찬</td>
              <td>찬</td>
              <td>찬</td>
              <td>찬</td>
              <td>찬</td>
              <td>○</td>
            </tr>
            <tr>
              <th>개인정보수집</th>
              <th colSpan={3}>은행명</th>
              <th colSpan={4}>계좌번호</th>
            </tr>
            <tr>
              <td>○</td>
              <td colSpan={3}>농협</td>
              <td colSpan={4}>123-1111-111-11</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
