import React from 'react';
import Header from '@/Components/Header';
import { Link, usePage } from '@inertiajs/react';

const ImagePage = () => {
    const { album_id, image } = usePage().props;

    return (
        <div className="min-h-screen bg-white flex flex-col">
            <Header />

            {/* Conteneur principal centré (2/3 de la page) */}
            <div className="w-4/5 sm:w-2/3 mx-auto">
                
                {/* Bouton Retour aligné à gauche */}
                <div className="pl-4 pt-10 pb-4">
                    <Link 
                        href={`/albums/${album_id}#image-${image.id}`} 
                        className="flex items-center text-gray-600 hover:text-gray-900"
                        onClick={(e) => {
                            e.preventDefault();
                            const target = document.getElementById(`image-${image.id}`);
                            if (target) {
                                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                            window.history.pushState({}, '', `/albums/${album_id}#image-${image.id}`);
                        }}
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-5 h-5 mr-2"
                        >
                            <path fillRule="evenodd" d="M19 12.75H5.56l5.22 5.22a.75.75 0 01-1.06 1.06l-6.5-6.5a.75.75 0 010-1.06l6.5-6.5a.75.75 0 011.06 1.06L5.56 11.25H19a.75.75 0 010 1.5z" clipRule="evenodd"/>
                        </svg>
                        Retour
                    </Link>
                </div>

                {/* Conteneur de l’image */}
                <div className="flex-grow flex justify-center items-center h-full">
                    <img 
                        src={`/storage/${image.link}`} 
                        alt={image.name} 
                        className="w-full h-full object-contain rounded-3xl"
                    />
                </div>
                {/* Texte de l'image + Bouton de téléchargement */}
                <div className="w-full flex justify-between pt-4">
                    {/* Texte de l’image */}
                    <div>
                        <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl">Jaimes Lefoto</h1>
                        <h4 className='font-bold text-lg sm:text-xl md:text-2xl'>{new Date(image.created_at).toLocaleDateString('fr-FR')}</h4>
                        <p className="text-sm sm:text-base md:text-lg">ISO-{image.ISO}, {image.ouverture}, {image.vitesse_obturation}</p>
                    </div>

                    {/* Bouton de téléchargement */}
                    <a 
                        href={`/storage/${image.link}`} 
                        download 
                        className="pt-2 pr-5"
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            viewBox="0 0 24 24" 
                            fill="currentColor" 
                            className="w-8 h-8"
                        >
                            <path fillRule="evenodd" d="M12 15.25a.75.75 0 01-.53-.22l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V4a.75.75 0 011.5 0v8.69l3.22-3.22a.75.75 0 011.06 1.06l-4.5 4.5a.75.75 0 01-.53.22zM4 19.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H4.75a.75.75 0 01-.75-.75z" clipRule="evenodd"/>
                        </svg>
                    </a>
                </div>
            </div>

            {/* Détails de l’image */}
            <div className="p-6 text-center">
                <h1 className="text-2xl font-bold">{image.name}</h1>
                <p className="text-gray-600">{image.date}</p>
                <p className="text-gray-500">{image.details}</p>
            </div>
        </div>
    );
};

export default ImagePage;
