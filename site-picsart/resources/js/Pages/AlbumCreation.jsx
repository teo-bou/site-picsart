import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const AlbumCreation = () => {
    const [name, setName] = useState('');
    const [photographer, setPhotographer] = useState({name: '', id: ''});
    const [photographers, setPhotographers] = useState([]);
    const [message, setMessage] = useState('');
    const [allPhotographers, setAllPhotographers] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());

    useEffect(() => {
        // Fetch existing photographers from the server
        axios.get('/users')
            .then(response => {
                setAllPhotographers(response.data.users.map((user) => ({
                    name: user.firstname + ' ' + user.lastname,
                    id: user.id
                })));
            })
            .catch(error => {
                console.error('Error fetching photographers:', error);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        try {
            const response = await axios.post('/upload-album', {
                name: name,
                event_at: selectedDate.toISOString().split('T')[0],
                photographers: photographers.map(p => ({ id: p.id }))
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            console.log(response.data); // Vérifier la réponse du backend
            setMessage('Album created successfully');
            window.location.href = '/';
        } catch (error) {
            console.error('Erreur Axios:', error.response?.data || error);
            setMessage(`Album creation failed: ${error.response?.data?.error || 'Unknown error'}`);
        }
    };

    const handleAddPhotographer = () => {
        if (photographer.id && !photographers.some(p => p.id === photographer.id)) {
            setPhotographers([...photographers, photographer]);
            setPhotographer({name: '', id: ''});
        }
    };

    const handleRemovePhotographer = (id) => {
        setPhotographers(photographers.filter(p => p.id !== id));
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
            <h1 className="text-4xl font-bold mb-6">Créer un album</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-6 rounded-lg shadow">
                {/* Album Name Input */}
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Entrer le nom de l’Album"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border rounded-lg px-4 py-2"
                        required
                    />
                </div>

                {/* Calendar and Mentions */}
                <div className="flex gap-6 items-start">
                    {/* Calendar */}
                    <div>
                        <Calendar
                            className="border rounded-lg p-2 shadow-sm"
                            onChange={setSelectedDate}
                            value={selectedDate}
                        />
                        <p className="mt-2 text-gray-600">Selected Date: {selectedDate.toDateString()}</p>
                    </div>

                    {/* User Mentions */}
                    <div className="text-gray-600 space-y-2">
                        {photographers.map((photog, index) => (
                            <div key={index} className="flex items-center">
                                <p className="font-bold">@ {photog.name}</p>
                                <button
                                    type="button"
                                    onClick={() => handleRemovePhotographer(photog.id)}
                                    className="ml-2 text-red-500 hover:text-red-700"
                                >
                                   X
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-4 flex gap-2">
                    <select
                        value={photographer.name}
                        onChange={(e) => {
                            const selectedPhotographer = {name: e.target.selectedOptions[0].text, id: e.target.value};
                            setPhotographer(selectedPhotographer);
                        }}
                        className="w-full border rounded-lg px-4 py-2"
                    >   
                        <option value="">{photographer.name ? photographer.name : 'Sélectionner un photographe'}</option>
                        {allPhotographers
                            .filter(photog => photographers.every(p => p.id != photog.id))
                            .map((photog, index) => (
                                <option key={index} value={photog.id}>{photog.name}</option>
                            ))
                        }
                    </select>
                    
                    <button
                        type="button"
                        onClick={handleAddPhotographer}
                        className="border rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-200">
                        Ajouter
                    </button>
                </div>

                <div className="mt-6 flex justify-center">
                    <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800">
                        Valider
                    </button>
                </div>
            </form>

            {/* Success/Error Message */}
            {message && <p className="mt-4 text-center text-gray-700">{message}</p>}
        </div>
    );
};

export default AlbumCreation;