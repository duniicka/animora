import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditPet = () => {
    const { petId } = useParams();
    const navigate = useNavigate();   
    interface PetData {
        name: string;
        age: string;
        breed: string;
        description: string;
        images: File[];
    }

    const [petData, setPetData] = useState<PetData>({
        name: '',
        age: '',
        breed: '',
        description: '',
        images: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPetData = async () => {
            try {
                const response = await axios.get(`/api/pets/${petId}`);
                setPetData(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching pet data:', error);
            }
        };
        fetchPetData();
    }, [petId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setPetData({ ...petData, [name]: value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files ? Array.from(e.target.files) : [];
        setPetData({ ...petData, images: files });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', petData.name);
        formData.append('age', petData.age);
        formData.append('breed', petData.breed);
        formData.append('description', petData.description);
        petData.images.forEach((file) => {
            formData.append('images', file);
        });

        try {
            await axios.put(`/api/pets/${petId}`, formData);
            navigate('/mypets');   // history.push() əvəzinə
        } catch (error) {
            console.error('Error updating pet data:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Edit Pet</h2>
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
                    <input type="file" multiple onChange={handleImageChange} />
                </div>
                <button type="submit">Update Pet</button>
            </form>
        </div>
    );
};

export default EditPet;
