// src/components/SkeletonCard.js
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const SkeletonCard = () => {
  return (
    <div className="col-md-4 mb-4">
      <div className="card shadow-sm h-100">
        <div className="card-body">
          <h5><Skeleton height={24} width={`80%`} /></h5>
          <p><Skeleton count={3} /></p>
          <Skeleton width={80} height={20} />
          <div className="d-flex justify-content-end mt-2">
            <Skeleton circle width={24} height={24} className="me-3" />
            <Skeleton circle width={24} height={24} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCard;
