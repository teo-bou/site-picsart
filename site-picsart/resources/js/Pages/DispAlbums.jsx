import React from 'react';
import { usePage, Link } from '@inertiajs/react';
import Header from '@/Components/Header';

const DispAlbums = () => {
    const { albums_user , user, albums} = usePage().props;
    console.log(user);
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
        <div className="bg-gray-100 min-h-screen">
            <Header />
            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-gray-800">Album Gallery</h1>
                <Link 
                    href="/albums/create" 
                    className="inline-block mt-4 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500"
                >
                    Create Album
                </Link>
                <h1 className="text-2xl font-semibold text-gray-700 mt-6">Welcome {user.firstname} {user.lastname}</h1>
                <h1 className="text-2xl font-semibold text-gray-700 mt-6">Your Albums</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {albums_user.map((album) => (
                        <div key={album.id} className="relative bg-white shadow-lg rounded-lg overflow-hidden">
                            <Link href={`/albums/${album.id}`}>
                                <img 
                                    src={album.cover || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'} 
                                    alt="Album Cover" 
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold text-gray-700">{album.name}</h2>
                                    <p className="text-gray-500 text-sm">{formatDate(album.event_at)}</p>
                                </div>
                            </Link>
                            <button 
                                onClick={() => handleDelete(album.id)} 
                                className="absolute top-2 right-2 bg-red-700 text-white p-1 rounded-full hover:bg-red-600"
                            >
                                🗑️
                            </button>
                        </div>
                    ))}


                </div>
                <h1 className="text-2xl font-semibold text-gray-700 mt-6">All Albums</h1>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                    {albums.map((album) => (
                        <div key={album.id} className="relative bg-white shadow-lg rounded-lg overflow-hidden">
                            <Link href={`/albums/${album.id}`}>
                                <img 
                                    src={album.cover || 'https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930'} 
                                    alt="Album Cover" 
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold text-gray-700">{album.name}</h2>
                                    <p className="text-gray-500 text-sm">{formatDate(album.event_at)}</p>
                                </div>
                            </Link>
                        </div>
                    ))}
                    </div>
            </div>
        </div>
    );
};

export default DispAlbums;