import React from 'react';

import { CarouselView } from './carousel';
import { Col, Container, Row } from 'react-bootstrap';
import { KEEMPrinciples } from './KEEMPrinciples';

export const Home = () => {
  return (
    <React.Fragment>
      <CarouselView />
      <Container>
        <Row className='justify-content-center mt-5 mb-5'>
          <Col xs={12}>
            <KEEMPrinciples />
          </Col>
        </Row>
      </Container>
    </React.Fragment>
  );
};
