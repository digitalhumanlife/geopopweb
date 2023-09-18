import qs from 'qs';
import { useEffect } from 'react';
import { decrypt } from '../utilities/pass';

const Nice = (props: any) => {
  const query = qs.parse(props.location.search);

  useEffect(() => {
    const { enc_data, integrity_value } = query;
    const token_version_id = query['?token_version_id'];

    if (enc_data && token_version_id && integrity_value) {
      const data = decrypt({
        enc_data: `${enc_data}`,
        token_version_id: `${token_version_id}`,
        integrity_value: `${integrity_value}`,
      });

      localStorage.setItem('nicePass', JSON.stringify(data));
      window.close();
      return;
    }
  });

  return null;
};

export default Nice;
