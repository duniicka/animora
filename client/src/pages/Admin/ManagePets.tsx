import React, { useEffect, useState } from 'react';
import axios from 'axios';

type Pet = {
    _id: string;
    name: string;
    breed: string;
    age: number;
};

const ManagePets = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const response = await axios.get('/api/pets');
                setPets(response.data);
            } catch (err) {
                setError('Failed to fetch pets');
            } finally {
                setLoading(false);
            }
        };

        fetchPets();
    }, []);

    const handleDelete = async (petId: string) => {
        try {
            await axios.delete(`/api/pets/${petId}`);
            setPets(prevPets => prevPets.filter(pet => pet._id !== petId));
        } catch (err) {
            setError('Failed to delete pet');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>Manage Pets</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Breed</th>
                        <th>Age</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {pets.map(pet => (
                        <tr key={pet._id}>
                            <td>{pet.name}</td>
                            <td>{pet.breed}</td>
                            <td>{pet.age}</td>
                            <td>
                                <button onClick={() => handleDelete(pet._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManagePets;