// src/components/my-editor/Media.jsx
import React from 'react';
import PropTypes from 'prop-types';

const Media = (props) => {
  const entity = props.contentState.getEntity(props.block.getEntityAt(0));
  const { src } = entity.getData();
  const type = entity.getType();

  let media;
  if (type === 'image') {
    media = <img src={src} alt="Uploaded content" />;
  }

  return media;
};

Media.propTypes = {
  contentState: PropTypes.shape({
    getEntity: PropTypes.func.isRequired,
  }).isRequired,
  block: PropTypes.shape({
    getEntityAt: PropTypes.func.isRequired,
  }).isRequired,
};

export default Media;
