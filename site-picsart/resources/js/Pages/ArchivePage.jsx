import React, { useState } from 'react';
import Header from '@/Components/Header';
import { usePage } from '@inertiajs/react';

const ArchivePage = () => {
    const { album, photographers } = usePage().props;
    
    const handleDownloadArchive = () => {
        window.location.href = `/download-archive/${album.id}`;
    };

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            <div className="w-2/3 mx-auto pt-10">
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
                </div>

                {/* Lien de téléchargement de l'archive */}
                <div className="mt-6">
                    <button 
                        onClick={handleDownloadArchive} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                        Télécharger l'archive
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ArchivePage;
