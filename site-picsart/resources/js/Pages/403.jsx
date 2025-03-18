import React from 'react';

const Page403 = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                <h1 className="text-6xl font-bold text-red-600">403</h1>
                <h2 className="text-2xl font-semibold mt-4">Access Denied</h2>
                <p className="text-gray-600 mt-2">Sorry, you don't have permission to view this page.</p>
                <a href="/" className="mt-6 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Go to Homepage
                </a>
            </div>
        </div>
    );
};

export default Page403;