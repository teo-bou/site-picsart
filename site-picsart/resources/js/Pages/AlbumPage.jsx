import React, { useState, useEffect } from 'react';
import Header from '@/Components/Header';
import ImageUpload from '@/Components/ImageUpload';
import { usePage, Link } from '@inertiajs/react';
import axios from 'axios';

const AlbumPage = () => {
    const { album, images, photographers, userId } = usePage().props;
    const [image, setImage] = useState(null);
    const [isSelectionMode, setIsSelectionMode] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [showArchiveConfirm, setShowArchiveConfirm] = useState(false);

    useEffect(() => {
        if (album.archived) {
            window.location.href = `/archive/${album.id}`;
        }
    }, [album]);

    const toggleSelectionMode = () => {
        setIsSelectionMode(!isSelectionMode);
        setSelectedImages([]);
    };

    const handleImageSelect = (imageId) => () => {
        if(isSelectionMode){
            if (selectedImages.includes(imageId)) {
                setSelectedImages(selectedImages.filter(id => id !== imageId));
            } else {
                setSelectedImages([...selectedImages, imageId]);
            }
        } else {
            window.location.replace(`/images/${imageId}`);
        }
    };

    const handleImageClick = (imageId) => {
        if (isSelectionMode) {
            handleImageSelect(imageId);
        } else {
            window.location.href = `/image/${imageId}`;
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

    const handleArchiveSelected = () => {
        axios.post('/archive-images', { imageIds: selectedImages })
            .then(response => {
                alert('Images archivées et supprimées');
                window.location.reload();
            })
            .catch(error => {
                alert('Problème lors de l\'archivage des images');
                console.error(error);
            });
    };

    const handleSetCoverImage = () => {
        if (selectedImages.length === 1) {
            const selectedImageId = selectedImages[0];
            const selectedImage = images.find(image => image.id === selectedImageId);
            axios.post(`/albums/${album.id}/set-cover`, { link_cover: selectedImage.link })
                .then(response => {
                    alert('Image de couverture mise à jour');
                    window.location.reload();
                })
                .catch(error => {
                    alert('Problème lors de la mise à jour de l\'image de couverture');
                    console.error(error);
                });
        } else {
            alert('Veuillez sélectionner une seule image pour définir comme couverture');
        }
    };

    const handleArchiveAlbum = () => {
        setShowArchiveConfirm(true);
    };

    const confirmArchiveAlbum = () => {
        axios.post(`/albums/${album.id}/archive`)
            .then(response => {
                alert('Album archivé');
                window.location.reload();
            })
            .catch(error => {
                alert('Problème lors de l\'archivage de l\'album');
                console.error(error);
            });
    };

    const cancelArchiveAlbum = () => {
        setShowArchiveConfirm(false);
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
                        {photographers && photographers.length > 0 && (
                            <p className="text-gray-500">
                                {photographers.map((photographer, index) => (
                                    <span key={photographer.id}>
                                        @ {photographer.firstname} {photographer.lastname}{index < photographers.length - 1 ? ', ' : ''}
                                    </span>
                                ))}
                            </p>
                        )}
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

                        {/* Bouton pour définir l'image de couverture */}
                        {isSelectionMode && (
                            <button onClick={handleSetCoverImage} className="p-3">
                                <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-120q-33 0-56.5-23.5T120-200v-240h80v240h240v80H200Zm320 0v-80h240v-240h80v240q0 33-23.5 56.5T760-120H520ZM240-280l120-160 90 120 120-160 150 200H240ZM120-520v-240q0-33 23.5-56.5T200-840h240v80H200v240h-80Zm640 0v-240H520v-80h240q33 0 56.5 23.5T840-760v240h-80Zm-140-40q-26 0-43-17t-17-43q0-26 17-43t43-17q26 0 43 17t17 43q0 26-17 43t-43 17Z"/></svg>
                            </button>
                        )}

                        {/* Bouton pour archiver l'album */}
                        <button onClick={handleArchiveAlbum} className="p-3">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#000000"><path d="M200-80q-33 0-56.5-23.5T120-160v-451q-18-11-29-28.5T80-680v-120q0-33 23.5-56.5T160-880h640q33 0 56.5 23.5T880-800v120q0 23-11 40.5T840-611v451q0 33-23.5 56.5T760-80H200Zm0-520v440h560v-440H200Zm-40-80h640v-120H160v120Zm200 280h240v-80H360v80Zm120 20Z"/></svg>
                        </button>

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
                        gridTemplateColumns: "repeat(auto-fit, minmax(275px, 1fr))",
                        gap: "16px"
                    }}
                >
                    {images.map((image) => (
                        <div 
                            key={image.id}
                            className={`relative block cursor-pointer`} 
                            onClick={handleImageSelect(image.id)}
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
                    <ImageUpload albumId={album.id} userId={userId} />
                </div>

            </div>
            {showArchiveConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Confirmer l'archivage</h2>
                        <p className="mb-4">Êtes-vous sûr de vouloir archiver cet album ?</p>
                        <div className="flex justify-end space-x-4">
                            <button onClick={cancelArchiveAlbum} className="px-4 py-2 bg-gray-300 rounded">Annuler</button>
                            <button onClick={confirmArchiveAlbum} className="px-4 py-2 bg-red-600 text-white rounded">Confirmer</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlbumPage;
