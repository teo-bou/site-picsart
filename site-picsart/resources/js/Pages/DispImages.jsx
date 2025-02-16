import React from 'react';
import { usePage } from '@inertiajs/react';


const DispImages = () => {
    const { images } = usePage().props;
    console.log(images);
    return (
        <div>
            <h1 className="p-3">Image Gallery</h1>
            <a  className=' p-3 block mt-4 text-indigo-600 hover:text-indigo-500'   href="/">Upload Image</a>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {images.map((image) => (
                    <div key={image.id} style={{ margin: '10px' }}>
                        <img src={`/storage/${image.link}`} alt="Uploaded" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DispImages;