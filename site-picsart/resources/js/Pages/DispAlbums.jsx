import React from 'react';
import { usePage, Link } from '@inertiajs/react';

const DispAlbums = () => {
    const { albums } = usePage().props;
    console.log(albums);
    return (
        <div>
            <h1 className="p-3">Album Gallery</h1>
            <a className='p-3 block mt-4 text-indigo-600 hover:text-indigo-500' href="/albums/create">Create Album</a>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {albums.map((album) => (
                    <Link key={album.id} href={`/albums/${album.id}`}  style={{ margin: '10px' }}>
                        {album.name}
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default DispAlbums;
