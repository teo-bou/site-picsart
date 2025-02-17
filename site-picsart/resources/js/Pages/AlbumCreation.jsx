import React, { useState } from 'react';
import axios from 'axios';

const AlbumCreation = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);

        axios.post('/upload-album', formData)
            .then(response => {
                setMessage('Album created successfully');
            })
            .catch(error => {
                setMessage('Album creation failed');
                console.error(error);
            });
    };

    return (
        <div>
            <h1>Create Album</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Album Name:</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Create</button>
            </form>
            {message && <p>{message}</p>}
            <a href='/albums' className='block mt-4 text-indigo-600 hover:text-indigo-500'>View Albums</a>
        </div>
    );
};

export default AlbumCreation;