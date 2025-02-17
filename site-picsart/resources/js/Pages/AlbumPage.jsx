import React, { useState } from 'react';
import { usePage, Link } from '@inertiajs/react';
import axios from 'axios';

const AlbumPage = () => {
    const { album, images } = usePage().props;
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', image);
        formData.append('album_id', album.id);

        axios.post('/upload-image', formData)
            .then(response => {
                alert('Image uploaded successfully');
                window.location.reload();
            })
            .catch(error => {
                alert('Image upload failed');
                console.error(error);
            });
    };

    return (
        <div>
            <h1 className="p-3">{album.name}</h1>
            <form className='space-y-4' onSubmit={handleSubmit}>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Image</label>
                    <input type='file' accept="image/*" className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm' onChange={handleImageChange} />
                </div>
                <button type='submit' className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                    Upload
                </button>
            </form>
            <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '20px' }}>
                {images.map((image) => (
                    <Link key={image.id} href={`/images/${image.id}`} style={{ margin: '10px' }}>
                        <img src={`/storage/${image.link}`} alt="Uploaded" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default AlbumPage;