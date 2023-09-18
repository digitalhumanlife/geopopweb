import React, { useState } from 'react';
import {
  processValue,
  processValuesLH,
  processValuesBasic,
  processValuesLease,
  processValuesLands,
} from '../../constants/process';

interface ProcessImgPropsType {
  type: string;
}

const ProcessImg = ({ type }: ProcessImgPropsType) => {
  const [selectedProcess, setSelectedProcess] = useState<number>(0);

  const selectProcessClick = (id: number) => {
    if (selectedProcess === id) {
      setSelectedProcess(0);
      document.querySelector('.process-step')?.classList.remove('extend');
      return;
    }
    document.querySelector('.process-step')?.classList.add('extend');

    setSelectedProcess(id);
  };

  return (
    <div className="product-content">
      {type === '분양' && (
        <>
          <h2 className="product-content__title">
            진행과정<small>[ 분양개발 사업 ]</small>
          </h2>
          <div className="product-content__process" data-type="basic">
            <div className="process-cmt">* 세부사항 이미지 클릭</div>
            <div className="process-step">
              <ul>
                {processValuesBasic.map((item: processValue, index: number) => (
                  <li key={index} className={selectedProcess === item.id ? item.cla + ' selected' : item.cla}>
                    <button onClick={() => selectProcessClick(item.id)}>
                      <i className="order">
                        <strong>{index + 1}</strong>
                      </i>
                      <span className="subject">{item.sbj}</span>
                    </button>
                    {selectedProcess === item.id && <div className="guide">{item.cont}</div>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
      {type === 'LH' && (
        <>
          <h2 className="product-content__title">
            진행과정<small>[ LH 민간주택 매입약정사업 ]</small>
          </h2>
          <div className="product-content__process" data-type="lh">
            <div className="process-cmt">* 세부사항 이미지 클릭</div>
            <div className="process-step">
              <ul>
                {processValuesLH.map((item: processValue, index: number) => (
                  <li key={index} className={selectedProcess === item.id ? item.cla + ' selected' : item.cla}>
                    <button onClick={() => selectProcessClick(item.id)}>
                      <i className="order">
                        <strong>{index + 1}</strong>
                      </i>
                      <span className="subject">{item.sbj}</span>
                    </button>
                    {selectedProcess === item.id && <div className="guide">{item.cont}</div>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}

      {type === '임대' && (
        <>
          <h2 className="product-content__title">
            진행과정<small>[ 임대개발 사업 ]</small>
          </h2>
          <div className="product-content__process" data-type="lease">
            <div className="process-cmt">* 세부사항 이미지 클릭</div>
            <div className="process-step">
              <ul>
                {processValuesLease.map((item: processValue, index: number) => (
                  <li key={index} className={selectedProcess === item.id ? item.cla + ' selected' : item.cla}>
                    <button onClick={() => selectProcessClick(item.id)}>
                      <i className="order">
                        <strong>{index + 1}</strong>
                      </i>
                      <span className="subject">{item.sbj}</span>
                    </button>
                    {selectedProcess === item.id && <div className="guide">{item.cont}</div>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
      {type === '부동산' && (
        <>
          <h2 className="product-content__title">
            진행과정<small>[ 부동산 매입 사업 ]</small>
          </h2>
          <div className="product-content__process" data-type="land">
            <div className="process-cmt">* 세부사항 이미지 클릭</div>
            <div className="process-step">
              <ul>
                {processValuesLands.map((item: processValue, index: number) => (
                  <li key={index} className={selectedProcess === item.id ? item.cla + ' selected' : item.cla}>
                    <button onClick={() => selectProcessClick(item.id)}>
                      <i className="order">
                        <strong>{index + 1}</strong>
                      </i>
                      <span className="subject">{item.sbj}</span>
                    </button>
                    {selectedProcess === item.id && <div className="guide">{item.cont}</div>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ProcessImg;
