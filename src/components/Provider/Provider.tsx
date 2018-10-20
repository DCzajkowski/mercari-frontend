import * as React from 'react';
import './Provider.css';

interface Props {
  image: string;
  title: string;
}

const Provider: React.SFC<Props> = ({ image, title }) => (
  <div className="Provider">
    <img src={image} alt={title} />
    <h3>{title}</h3>
  </div>
);

export default Provider;
