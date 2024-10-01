import React, { useState } from 'react';
import axios from 'axios';
import '../../css/NewBid.css'; // Import the custom CSS

const NewBid = () => {
    const [formData, setFormData] = useState({
        StartDate: '',
        MonthDuration: '',
        BidSize: '',
        AD: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/bids/newbid', formData);
            console.log(response.data);
            // Reset form after successful submission
            setFormData({
                StartDate: '',
                MonthDuration: '',
                BidSize: '',
                AD: ''
            });
            alert('Bid created successfully!');
        } catch (err) {
            console.error('Error creating bid:', err);
        }
    };

    return (
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-12 col-md-10 col-lg-8 col-xl-7">
                    <div className="card">
                        <div className="card-body">
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="StartDate">Start Date</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="StartDate"
                                        name="StartDate"
                                        value={formData.StartDate}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="MonthDuration">Month Duration</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="MonthDuration"
                                        name="MonthDuration"
                                        value={formData.MonthDuration}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="BidSize">Bid Size</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="BidSize"
                                        name="BidSize"
                                        value={formData.BidSize}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="AD">AD</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="AD"
                                        name="AD"
                                        value={formData.AD}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <button type="submit" className="btn btn-primary mt-3">
                                    Submit
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NewBid;
