import { toLower } from 'lodash';
import classnames from 'classnames';
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { RouteComponentProps } from 'react-router-dom';
import { useUser } from '../store/hooks/hooks';
import APIService from '../services/API';

import './UserGuide.scss';
import TitleNotice from '../statics/images/v3/bg-notice.jpg';
import ConfirmationDialog from '../components/ConfirmationDialog';

export default function UserGuide(props: RouteComponentProps) {
  const [searchText, setSearchText] = useState<string>('');
  const [userGuidesRaw, setUserGuidesRaw] = useState<any[]>([]);
  const [userGuides, setUserGuides] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedUserGuide, setSelectedUserGuide] = useState<number>(0);
  const [visibleConfirmDelete, setVisibleConfirmDelete] = useState<boolean>(false);

  const user = useUser();

  const getUserGuides = async () => {
    const data = await APIService.getUserGuides();
    if (data.success) {
      setUserGuidesRaw(data.data);
      let category: string[] = [];
      const user_guides = data.data.map((item: any) => {
        const item_category = item.title.split('] ')[0].replace('[', '');
        const title = item.title.split('] ')[1];
        item.category = item_category;
        item.title = title;
        if (category.indexOf(item_category) === -1) {
          category.push(item_category);
        }
        return item;
      });
      setCategories(category);
      setUserGuides(user_guides);
    }
  };

  const handleEditClick = (e: any, item: any) => {
    props.history.push('/new-user-guide?id=' + item.id);
    e.stopPropagation();
  };

  const handleRemoveClick = (item: any) => {
    setSelectedUserGuide(item.id);
    setVisibleConfirmDelete(true);
  };

  const handleUserGuideExpanded = (item: any) => {
    if (selectedUserGuide !== item.id) setSelectedUserGuide(item.id);
    else setSelectedUserGuide(0);
  };

  const handleSearchChange = (e: any) => {
    setSearchText(e.target.value);
  };

  const handleConfirmDialogAccept = async () => {
    await APIService.removeUserGuide(selectedUserGuide);
    setVisibleConfirmDelete(false);
    getUserGuides();
  };

  const handleConfirmDialogDismiss = () => {
    setVisibleConfirmDelete(false);
  };

  useEffect(() => {
    const data = userGuidesRaw.filter((item: any) => {
      return (
        toLower(item['title']).indexOf(toLower(searchText)) >= 0 ||
        toLower(item['content']).indexOf(toLower(searchText)) >= 0
      );
    });

    const tempArr = data.map((argument) => argument.category);
    const uniqueArr = tempArr.filter((element, index) => tempArr.indexOf(element) === index);

    setCategories(uniqueArr);
    setUserGuides(data);
  }, [searchText, userGuidesRaw]);

  useEffect(() => {
    getUserGuides();
  }, []);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="user-guide-wrapper">
      <div className="common-header">
        <img src={TitleNotice} alt="" />
        <h1 className="text-center">자주 하는 질문</h1>
      </div>
      <div className="user-guide-container">
        {user.isAdmin() && (
          <div className="new-user-guide">
            <Button label="New UserGuide" onClick={() => props.history.push('/new-user-guide')} />
          </div>
        )}
        <div className="search-group">
          <div className="search-input">
            <InputText placeholder="검색어를 입력해주세요." onChange={handleSearchChange} />
            <span className="pi pi-search"></span>
          </div>
        </div>
        <div className="user-guide-content">
          {categories.map((category: string, idx: number) => {
            return (
              <div key={idx}>
                <h2>{category}</h2>

                {userGuides
                  .filter((item: any) => item.category === category)
                  .map((item: any, idx: number) => {
                    return (
                      <div className="user-guide-list" key={idx}>
                        <div className="user-guide-row">
                          <div className="type">Q</div>
                          <div className="left-content">
                            <span className="font-regular" onClick={() => handleUserGuideExpanded(item)}>
                              {item.title}
                            </span>
                          </div>
                          <div className="right-content">
                            {selectedUserGuide === item.id ? (
                              <span className="btn btn-show" onClick={() => handleUserGuideExpanded(item)}></span>
                            ) : (
                              <span className="btn" onClick={() => handleUserGuideExpanded(item)}></span>
                            )}
                          </div>
                        </div>
                        <div
                          className={classnames('user-guide-content-row', {
                            show: selectedUserGuide === item.id,
                          })}
                        >
                          <div className="type">A</div>
                          <p>{item.content}</p>
                          {user.isAdmin() && (
                            <div className="edit-remove-group">
                              <Button icon="pi pi-pencil" onClick={(e) => handleEditClick(e, item)} />
                              <Button
                                className="p-button-danger"
                                icon="pi pi-times"
                                onClick={() => handleRemoveClick(item)}
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </div>
      <ConfirmationDialog
        header="Confirm"
        visible={visibleConfirmDelete}
        acceptText="Yes"
        dismissText="No"
        onAccept={handleConfirmDialogAccept}
        onDismiss={handleConfirmDialogDismiss}
        message="Remove this user-guide?"
      />
    </div>
  );
}
