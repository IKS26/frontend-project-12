import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Row, Col, Card } from 'react-bootstrap';
import notFoundImage from '../../public/assets/Error_404.jpg';

const PageNotFound = () => {
  const { t } = useTranslation('errors');

  return (
    <Container fluid className="h-100 d-flex align-items-center justify-content-center">
      <Row className="justify-content-center">
        <Col xs={12} md={8} lg={6}>
          <Card className="shadow-sm login-card text-center p-4">
            <Card.Body>
              <img src={notFoundImage} alt={t('pageNotFound.title')} className="img-fluid h-25 mb-4 img-custom" />
              <h1 className="text-yellow">{t('pageNotFound.title')}</h1>
              <p>
                {t('pageNotFound.description')}{' '}
                <Link to="/" className="text-yellow">
                  {t('pageNotFound.homeLink')}
                </Link>
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PageNotFound;

