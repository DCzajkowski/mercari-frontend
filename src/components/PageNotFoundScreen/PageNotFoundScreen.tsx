import * as React from 'react';
import { Link } from 'react-router-dom';

const PageNotFoundScreen = () => (
  <div>
    <h1>Error 404</h1>
    <Link to="/">get back to home page</Link>
  </div>
);

export default PageNotFoundScreen;
