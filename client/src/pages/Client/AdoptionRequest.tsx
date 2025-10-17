import React, { useState } from 'react';

const AdoptionRequest = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        petId: '',
        message: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle the submission logic here (e.g., API call)
        console.log('Adoption request submitted:', formData);
    };

    return (
        <div className="adoption-request">
            <h2>Adoption Request</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Your Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="email">Your Email:</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="petId">Pet ID:</label>
                    <input
                        type="text"
                        id="petId"
                        name="petId"
                        value={formData.petId}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="message">Message:</label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Submit Request</button>
            </form>
        </div>
    );
};

export default AdoptionRequest;