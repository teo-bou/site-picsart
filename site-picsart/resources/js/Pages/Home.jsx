import React, { useState } from 'react';
import { router, usePage } from '@inertiajs/react';

const Home = () => {
    const [image, setImage] = useState(null);

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        console.log(e.target.files[0]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('image', image);

        axios.post('/upload-image', formData)
            .then(response => {
            alert('Image uploaded successfully');
            })
            .catch(error => {
            alert('Image upload failed');
            console.error(error);
            });
    };

    return (
        <div className='p-10'>
            <h1 className='text-2xl mb-4'>Upload an Image</h1>
            <form className='space-y-4' onSubmit={handleSubmit}>
                <div>
                    <label className='block text-sm font-medium text-gray-700'>Image</label>
                    <input type='file' className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm' onChange={handleImageChange} />
                </div>
                <button type='submit' className='inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'>
                    Upload
                </button>
            </form>
            <a href='/images' className='block mt-4 text-indigo-600 hover:text-indigo-500'>View Images</a>
        </div>
    );
};

export default Home;
