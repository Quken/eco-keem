import { Card } from 'react-bootstrap';
import author from '../images/author.png';
import React from 'react';

export const AuthorCard = () => {
  return (
    <Card>
      <Card.Img variant='top' src={author} />
      <Card.Body>
        <Card.Title>David Guetta</Card.Title>
        <Card.Text>
          Pierre David Guetta is a French DJ, music programmer, record producer
          and songwriter.
        </Card.Text>
      </Card.Body>
    </Card>
  );
};
