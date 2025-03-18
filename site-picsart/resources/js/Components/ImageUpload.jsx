import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const ImageUpload = ({ albumId, userId }) => {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const onDrop = useCallback((acceptedFiles) => {
        setSelectedFiles(acceptedFiles);
        setIsModalOpen(true);
    }, []);

    const { getRootProps, getInputProps } = useDropzone({ 
        onDrop, 
        accept: 'image/jpeg, image/png, image/jpg, image/svg+xml, image/webp', 
        multiple: true 
    });

    const handleUpload = async () => {
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append('images[]', file);
        });
        formData.append('album_id', albumId);
        formData.append('user_id', userId); // Add userId to the request

        try {
            await axios.post('/upload-images', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            alert('Image(s) importée(s)');
            setIsModalOpen(false);
            setSelectedFiles([]);
            window.location.reload();
        } catch (error) {
            alert("Problème lors de l'importation des images");
            console.error(error);
        }
    };

    return (
        <div className="relative block">
            {/* Zone de Drop */}
            <div className='relative w-full pt-[63%] '>
                <div {...getRootProps()} className="absolute top-0 left-0 w-full object-cover flex justify-center items-center h-full cursor-pointer border-2 border-dashed border-gray-300 p-6 rounded-lg text-center">
                    <input {...getInputProps()} accept="image/jpeg, image/png, image/jpg, image/svg+xml, image/webp"/>
                    <div className="flex justify-center items-center flex-col">
                        <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <rect width="24" height="24" fill="white"></rect> <path d="M5 12V18C5 18.5523 5.44772 19 6 19H18C18.5523 19 19 18.5523 19 18V12" stroke="rgb(107 114 128 / var(--tw-text-opacity, 1))" strokeLinecap="round" strokeLinejoin="round"></path> <path d="M12 15L12 3M12 3L8 7M12 3L16 7" stroke="rgb(107 114 128 / var(--tw-text-opacity, 1))" strokeLinecap="round" strokeLinejoin="round"></path> </g></svg>
                        <p className="text-gray-500">Ajoutez des photos</p>
                    </div>
                </div>
            </div>

            {/* Modal de prévisualisation */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-1/3 max-h-[80%] overflow-hidden">
                        <h2 className="text-lg font-bold mb-4">Prévisualisation des images</h2>
                        <div className="overflow-y-auto max-h-[60vh] mb-4 scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
                            <div className="grid grid-cols-3 gap-2">
                                {selectedFiles.map((file, index) => (
                                    <img key={index} src={URL.createObjectURL(file)} alt={`preview-${index}`} className="w-full h-20 object-cover rounded-md" />
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-between">
                            <button className="px-4 py-2 bg-red-500 text-white rounded-md" onClick={() => setIsModalOpen(false)}>Annuler</button>
                            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md" onClick={handleUpload}>Upload</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
