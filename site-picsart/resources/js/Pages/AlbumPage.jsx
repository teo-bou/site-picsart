import React, { useState } from 'react';
import Header from '@/Components/Header';
import ImageUpload from '@/Components/ImageUpload';
import { usePage, Link } from '@inertiajs/react';
import axios from 'axios';

const AlbumPage = () => {
    const { album, images } = usePage().props;
    const [image, setImage] = useState(null);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedImages([]);
    };

    const handleImageSelect = (imageId) => {
        if (selectedImages.includes(imageId)) {
            setSelectedImages(selectedImages.filter(id => id !== imageId));
        } else {
            setSelectedImages([...selectedImages, imageId]);
        }
    };

    const handleDeleteSelected = () => {
        axios.post('/delete-images', { imageIds: selectedImages })
            .then(response => {
                alert('Image(s) supprimée(s)');
                window.location.reload();
            })
            .catch(error => {
                alert('Problème lors de la suppression des images');
                console.error(error);
            });
    };

    const handleDownloadSelected = () => {
        const imageIds = selectedImages.join(',');
        window.location.href = `/download-images?ids=${imageIds}`;
    };

    const handleDownloadAlbum = () => {
        const imageIds = images.map(image => image.id).join(',');
        window.location.href = `/download-images?ids=${imageIds}`;
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
                        <h4 className="text-lg sm:text-xl font-bold text-gray-600">{new Date(album.event_at).toLocaleDateString('fr-FR')}</h4>
                        <p className="text-gray-500">@Jaimes Léfoto, @Jean Bon</p>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Icône de téléchargement */}
                        <button 
                            onClick={isSelectionMode && selectedImages.length > 0 ? handleDownloadSelected : handleDownloadAlbum} 
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
                        </button>

                        {/* Icône de suppression */}
                        {isSelectionMode && (
                            <button onClick={handleDeleteSelected} className="p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                            </button>
                        )}

                        {/* Bouton de sélection */}
                        <button 
                            onClick={toggleSelectionMode} 
                            className={`p-3 rounded`}
                        >
                            {isSelectionMode ? <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3h18v18H3zM15 9l-6 6m0-6l6 6"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect></svg>}
                        </button>
                    </div>
                </div>

                {/* Grille des images avec adaptation automatique */}
                <div className="grid auto-cols-fr gap-4 mt-6 mb-10"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(275px, 0.95fr))",
                        gap: "16px"
                    }}
                >
                    {images.map((image) => (
                        <div 
                            key={image.id} 
                            className={`relative block ${isSelectionMode && 'cursor-pointer'}`} 
                            onClick={() => isSelectionMode && handleImageSelect(image.id)}
                        >
                            <div className="relative w-full" style={{ paddingTop: "63.25%" }}> {/* Ratio 16:9 */}
                                <img 
                                    id={`image-${image.id}`} 
                                    src={`/storage/${image.link}`} 
                                    alt={image.name} 
                                    className={`absolute top-0 left-0 w-full h-full object-cover rounded-lg ${selectedImages.includes(image.id) && 'opacity-50'}`}
                                />
                                {isSelectionMode && selectedImages.includes(image.id) && (
                                    <div className="absolute inset-0 flex justify-center items-center">
                                        <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                    <ImageUpload albumId={album.id} />
                </div>

            </div>
        </div>
    );
};

export default AlbumPage;
