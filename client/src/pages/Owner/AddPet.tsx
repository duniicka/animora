import React, { useState } from 'react';

const AddPet = () => {
    const [petData, setPetData] = useState<{
        name: string;
        age: string;
        breed: string;
        description: string;
        images: File[];
    }>({
        name: '',
        age: '',
        breed: '',
        description: '',
        images: []
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPetData({
            ...petData,
            [name]: value
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPetData({
            ...petData,
            images: e.target.files ? Array.from(e.target.files) : []
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Add logic to submit pet data to the server
    };

    return (
        <div className="add-pet-container">
            <h2>Add a New Pet</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input type="text" name="name" value={petData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label>Age:</label>
                    <input type="number" name="age" value={petData.age} onChange={handleChange} required />
                </div>
                <div>
                    <label>Breed:</label>
                    <input type="text" name="breed" value={petData.breed} onChange={handleChange} required />
                </div>
                <div>
                    <label>Description:</label>
                    <textarea name="description" value={petData.description} onChange={handleChange} required />
                </div>
                <div>
                    <label>Images:</label>
                    <input type="file" multiple onChange={handleImageChange} required />
                </div>
                <button type="submit">Add Pet</button>
            </form>
        </div>
    );
};

export default AddPet;