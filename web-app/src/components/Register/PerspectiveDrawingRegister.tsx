import React from 'react';
import { Col, Grid, Row } from 'react-flexbox-grid';
import { Field } from 'formik';
import FileUploadField from '../FileUploadField';
import { UPLOAD_FILE_CONFIG } from '../../constants/fileConfig';

interface PerspectiveDrawingRegisterPropsType {
  type: string;
  perspective_drawing_image1: any;
  perspective_drawing_image2: any;
  perspective_drawing_image3: any;
}

const PerspectiveDrawingRegister = ({
  type,
  perspective_drawing_image1,
  perspective_drawing_image2,
  perspective_drawing_image3,
}: PerspectiveDrawingRegisterPropsType) => {
  return (
    <>
      {type === '부동산' ? (
        <>
          <label className="label">
            사진 슬라이드 <small> 권장 이미지 사이즈 (867 * 639)</small>
          </label>
          <Grid>
            <Row>
              <Col xs={6}>
                <Field
                  component={FileUploadField}
                  value={perspective_drawing_image1}
                  name="perspective_drawing_image1"
                  uploadConfig={UPLOAD_FILE_CONFIG}
                  chooseLabel="사진 1"
                />
              </Col>
              <Col xs={6}>
                <Field
                  component={FileUploadField}
                  value={perspective_drawing_image2}
                  name="perspective_drawing_image2"
                  uploadConfig={UPLOAD_FILE_CONFIG}
                  chooseLabel="사진 2"
                />
              </Col>
              <Col xs={6} style={{ marginTop: '10px' }}>
                <Field
                  component={FileUploadField}
                  value={perspective_drawing_image3}
                  name="perspective_drawing_image3"
                  uploadConfig={UPLOAD_FILE_CONFIG}
                  chooseLabel="사진 3"
                />
              </Col>
              <Col xs={6} style={{ marginTop: '10px' }} />
            </Row>
          </Grid>
        </>
      ) : (
        <>
          <label className="label">
            투시도 이미지 슬라이드 <small> 권장 이미지 사이즈 (867 * 639)</small>
          </label>
          <Grid>
            <Row>
              <Col xs={6}>
                <Field
                  component={FileUploadField}
                  value={perspective_drawing_image1}
                  name="perspective_drawing_image1"
                  uploadConfig={UPLOAD_FILE_CONFIG}
                  chooseLabel="투시도 1"
                />
              </Col>
              <Col xs={6}>
                <Field
                  component={FileUploadField}
                  value={perspective_drawing_image2}
                  name="perspective_drawing_image2"
                  uploadConfig={UPLOAD_FILE_CONFIG}
                  chooseLabel="투시도 2"
                />
              </Col>
              <Col xs={6} style={{ marginTop: '10px' }}>
                <Field
                  component={FileUploadField}
                  value={perspective_drawing_image3}
                  name="perspective_drawing_image3"
                  uploadConfig={UPLOAD_FILE_CONFIG}
                  chooseLabel="투시도 3"
                />
              </Col>
              <Col xs={6} style={{ marginTop: '10px' }} />
            </Row>
          </Grid>
        </>
      )}
    </>
  );
};

export default PerspectiveDrawingRegister;
