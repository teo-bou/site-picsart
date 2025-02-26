import React, { useState } from 'react';
import Header from '@/Components/Header';
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
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            {/* Conteneur principal */}
            <div className="w-2/3 mx-auto pt-10">
                {/* Header Album */}
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-4xl sm:text-5xl font-bold">{album.name}</h1>
                        <h4 className="text-lg sm:text-xl font-bold text-gray-600">16 janv. 2027</h4>
                        <p className="text-gray-500">@Jaimes Léfoto, @Jean Bon</p>
                    </div>

                    {/* Icône de téléchargement */}
                    <a 
                        href={`/download-album/${album.id}`} 
                        className="p-3"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-6 h-6"
                        >
                            <path fillRule="evenodd" d="M12 15.25a.75.75 0 01-.53-.22l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V4a.75.75 0 011.5 0v8.69l3.22-3.22a.75.75 0 011.06 1.06l-4.5 4.5a.75.75 0 01-.53.22zM4 19.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H4.75a.75.75 0 01-.75-.75z" clipRule="evenodd"/>
                        </svg>
                    </a>
                </div>

                {/* Grille des images avec adaptation automatique */}
                <div className="grid auto-cols-fr gap-4 mt-6"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(275px, 0.95fr))",
                        gap: "16px"
                    }}
                >
                    {images.map((image) => (
                        <Link key={image.id} href={`/images/${image.id}?album_id=${album.id}`} className="block">
                            <div className="relative w-full" style={{ paddingTop: "56.25%" }}> {/* Ratio 16:9 */}
                                <img 
                                    id={`image-${image.id}`} 
                                    src={`/storage/${image.link}`} 
                                    alt={image.name} 
                                    className="absolute top-0 left-0 w-full h-full object-cover rounded-lg"
                                />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Formulaire d'upload en bas */}
            <div className="mt-auto w-2/3 mx-auto pb-10">
                <form className="bg-gray-100 p-4 rounded-lg shadow-md" onSubmit={handleSubmit}>
                    <label className="block text-sm font-medium text-gray-700">Ajouter une image</label>
                    <input 
                        type="file" 
                        accept="image/*" 
                        className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        onChange={handleImageChange} 
                    />
                    <button 
                        type="submit" 
                        className="mt-3 w-full px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700"
                    >
                        Upload
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AlbumPage;
