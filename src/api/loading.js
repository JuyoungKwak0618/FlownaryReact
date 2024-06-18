import React from 'react';
import './loading.css';

export default function Loading() {
  return (
    <div className="loading-container">
      <div className="loading"></div>
      <div id="loading-text">loading</div>
    </div>
  );
}
