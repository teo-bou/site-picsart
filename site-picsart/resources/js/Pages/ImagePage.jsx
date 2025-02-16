import React from 'react';

const ImagePage = ({ image }) => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <img src={image} alt="Displayed" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
    );
};

export default ImagePage;