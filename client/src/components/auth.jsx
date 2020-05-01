import React from 'react';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';

import { post } from '../utils/httpService';
import { LOGIN_URL } from '../utils/constants';

export const Auth = (props) => {
  const [login, setLogin] = React.useState('');
  const [password, setPassword] = React.useState('');

  const loginUser = () => {
    post(LOGIN_URL, {
      login: login,
      password: password
    }).then(({ data: user }) => {
      if (user) {
        props.onHide();
        props.setUser(user);
        sessionStorage.setItem('user', JSON.stringify(user));
      } else {
        alert('Incorrect login/password');
      }
    });
  };

  return (
    <Container>
      <Row className='justify-content-center'>
        <Col xs={6}>
          <Form>
            <Form.Group controlId='formUsername'>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type='input'
                placeholder='Enter username'
                value={login}
                onChange={(e) => setLogin(e.target.value)}
              />
            </Form.Group>

            <Form.Group controlId='formBasicPassword'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <Button variant='primary' onClick={loginUser}>
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};
