import React, { FC } from 'react';
import './PageNotFound.scss';

interface PageNotFoundProps { }

const PageNotFound: FC<PageNotFoundProps> = () => (
  <>
    <div className="PageNotFound">
      This page could not be found.
    </div>
  </>
);

export default PageNotFound;
