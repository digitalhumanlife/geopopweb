import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Button } from 'primereact/button';
import Doc1 from '../statics/docs/doc1.txt';
import Doc2 from '../statics/docs/doc2.txt';
import Doc3 from '../statics/docs/doc3.txt';
import './Policy.scss';

export default function Policy(props: RouteComponentProps) {
  const [doc1, setDoc1] = useState<any>('');
  const [doc2, setDoc2] = useState<any>('');
  const [doc3, setDoc3] = useState<any>('');
  const handleHomeClick = () => {
    props.history.push('/');
  };
  useEffect(() => {
    fetch(Doc1)
      .then((r) => r.text())
      .then((text) => {
        setDoc1(text);
      });
    fetch(Doc2)
      .then((r) => r.text())
      .then((text) => {
        setDoc2(text);
      });
    fetch(Doc3)
      .then((r) => r.text())
      .then((text) => {
        setDoc3(text);
      });
  }, []);

  return (
    <div className="policy-wrapper">
      <div className="common-header">
        <h1>GeoPop 정책</h1>
      </div>
      <div className="policy-container">
        <div className="policy-document" id="1">
          <h2 className="left">사이트 이용약관</h2>
          <div className="scroll-box">
            <div className="docs">{doc1}</div>
          </div>
        </div>
        <div className="policy-document" id="2">
          <h2 className="left">프로젝트 참여약관</h2>
          <div className="scroll-box">
            <div className="docs">{doc2}</div>
          </div>
        </div>
        <div className="policy-document" id="3">
          <h2 className="left">개인정보처리방침</h2>
          <div className="scroll-box">
            <div className="docs">{doc3}</div>
          </div>
        </div>
        <Button label="메인으로" onClick={handleHomeClick} />
      </div>
    </div>
  );
}
