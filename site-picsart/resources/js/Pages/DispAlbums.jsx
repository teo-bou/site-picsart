import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import Header from '@/Components/Header';

const DispAlbums = () => {
    const { albums } = usePage().props;
    console.log(albums);
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure you want to delete this album?')) {
            try {
                const response = await axios.delete(`/albums/${id}`);
                if (response.status === 200) {
                    window.location.reload();
                }
            } catch (error) {
                console.error('There was an error deleting the album!', error);
            }
        }
    };

    return (
        <div>
            <Header/>
            <div>
                <h1 className="p-3">Album Gallery</h1>
                <a className='p-3 block mt-4 text-indigo-600 hover:text-indigo-500' href="/albums/create">Create Album</a>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {albums.map((album) => (
                        <div key={album.id} style={{ margin: '10px', position: 'relative' }}>
                            <Link href={`/albums/${album.id}`}>
                                {album.name}
                                <div> {formatDate(album.event_at)} </div>
                            </Link>
                            <button 
                                onClick={() => handleDelete(album.id)} 
                                style={{ position: 'absolute', top: '0', right: '0' }}
                            >
                                🗑️
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DispAlbums;
