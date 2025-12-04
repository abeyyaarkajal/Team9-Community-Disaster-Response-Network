import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { incidentAPI } from '../services/api';
import { AlertTriangle, MapPin, Clock, Send } from 'lucide-react';

const CitizenDashboard = () => {
    const { user } = useContext(AuthContext);
    const [incidents, setIncidents] = useState([]);
    const [showReportForm, setShowReportForm] = useState(false);
    const [formData, setFormData] = useState({
        type: 'fire',
        description: '',
        severity: 'medium',
        location: {
            lat: 27.5,
            lng: 77.7,
            address: ''
        }
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await incidentAPI.create(formData);
            alert('Incident reported successfully!');
            setShowReportForm(false);
            setFormData({
                type: 'fire',
                description: '',
                severity: 'medium',
                location: { lat: 27.5, lng: 77.7, address: '' }
            });
        } catch (error) {
            alert('Error reporting incident: ' + error.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="container mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome, {user?.name}!
                    </h1>
                    <p className="text-gray-600">Citizen Dashboard</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Active Incidents</p>
                                <p className="text-3xl font-bold text-red-600">12</p>
                            </div>
                            <AlertTriangle size={48} className="text-red-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Your Reports</p>
                                <p className="text-3xl font-bold text-blue-600">3</p>
                            </div>
                            <MapPin size={48} className="text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Response Time</p>
                                <p className="text-3xl font-bold text-green-600">8m</p>
                            </div>
                            <Clock size={48} className="text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold">Report Incident</h2>
                        <button
                            onClick={() => setShowReportForm(!showReportForm)}
                            className="bg-red-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                        >
                            {showReportForm ? 'Cancel' : 'New Report'}
                        </button>
                    </div>

                    {showReportForm && (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Incident Type
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="fire">Fire</option>
                                    <option value="flood">Flood</option>
                                    <option value="earthquake">Earthquake</option>
                                    <option value="medical">Medical Emergency</option>
                                    <option value="accident">Accident</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    rows="4"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Severity
                                </label>
                                <select
                                    value={formData.severity}
                                    onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="critical">Critical</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-gray-700 font-semibold mb-2">
                                    Location Address
                                </label>
                                <input
                                    type="text"
                                    value={formData.location.address}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        location: { ...formData.location, address: e.target.value }
                                    })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2"
                            >
                                <Send size={20} />
                                Submit Report
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CitizenDashboard;
