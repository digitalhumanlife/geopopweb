import React, { useRef } from 'react';
import { RouteComponentProps, NavLink } from 'react-router-dom';
import { OverlayPanel } from 'primereact/overlaypanel';

import CONSTANTS from '../constants/constant';
import { useUser } from '../store/hooks/hooks';
import UploadData from '../components/UploadData';

import './Home.scss';
import UserProfileIcon from '../statics/images/gc/unnamed.png';

function Home(props: RouteComponentProps) {
  const userProfileRef = useRef<OverlayPanel>(null);

  const user = useUser();

  const handleShowProfile = (e: any) => {
    if (userProfileRef.current) {
      userProfileRef.current.toggle(e);
    }
  };

  return (
    <div className="home-container">
      <UploadData {...props} />
    </div>
  );
}

export default Home;
