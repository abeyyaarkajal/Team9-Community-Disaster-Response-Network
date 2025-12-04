import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { incidentAPI } from '../services/api';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

const VolunteerDashboard = () => {
    const { user } = useContext(AuthContext);
    const [incidents, setIncidents] = useState([]);

    useEffect(() => {
        fetchIncidents();
    }, []);

    const fetchIncidents = async () => {
        try {
            const response = await incidentAPI.getAll({ status: 'pending' });
            setIncidents(response.data || []);
        } catch (error) {
            console.error('Error fetching incidents:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="container mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome, {user?.name}!
                    </h1>
                    <p className="text-gray-600">Volunteer Dashboard</p>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Available Tasks</p>
                                <p className="text-3xl font-bold text-orange-600">8</p>
                            </div>
                            <AlertTriangle size={48} className="text-orange-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Completed</p>
                                <p className="text-3xl font-bold text-green-600">15</p>
                            </div>
                            <CheckCircle size={48} className="text-green-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Hours Served</p>
                                <p className="text-3xl font-bold text-blue-600">42</p>
                            </div>
                            <Clock size={48} className="text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6">Available Incidents</h2>

                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-800">Fire Emergency - Sector {item}</h3>
                                        <p className="text-gray-600 mt-2">Building fire reported, immediate response needed</p>
                                        <div className="flex gap-4 mt-3">
                                            <span className="text-sm text-gray-500">📍 2.5 km away</span>
                                            <span className="text-sm text-red-600 font-semibold">⚠️ High Priority</span>
                                        </div>
                                    </div>
                                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition">
                                        Accept Task
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VolunteerDashboard;