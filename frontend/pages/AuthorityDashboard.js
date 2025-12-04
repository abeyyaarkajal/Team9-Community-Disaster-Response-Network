import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AlertTriangle, Users, MapPin, Activity } from 'lucide-react';

const AuthorityDashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="container mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">
                        Welcome, {user?.name}!
                    </h1>
                    <p className="text-gray-600">Authority Dashboard - Command Center</p>
                </div>

                <div className="grid md:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Total Incidents</p>
                                <p className="text-3xl font-bold text-red-600">45</p>
                            </div>
                            <AlertTriangle size={48} className="text-red-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Active Volunteers</p>
                                <p className="text-3xl font-bold text-blue-600">128</p>
                            </div>
                            <Users size={48} className="text-blue-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Hazard Zones</p>
                                <p className="text-3xl font-bold text-orange-600">7</p>
                            </div>
                            <MapPin size={48} className="text-orange-600" />
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-600 text-sm">Response Rate</p>
                                <p className="text-3xl font-bold text-green-600">94%</p>
                            </div>
                            <Activity size={48} className="text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">Recent Incidents</h2>
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map((item) => (
                                <div key={item} className="border-l-4 border-red-600 pl-4 py-2">
                                    <h3 className="font-bold">Fire Emergency - Area {item}</h3>
                                    <p className="text-sm text-gray-600">Reported 15 min ago</p>
                                    <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                                        High Priority
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-2xl font-bold mb-4">Active Alerts</h2>
                        <div className="space-y-3">
                            {[1, 2, 3].map((item) => (
                                <div key={item} className="border-l-4 border-yellow-600 pl-4 py-2">
                                    <h3 className="font-bold">Weather Alert - Zone {item}</h3>
                                    <p className="text-sm text-gray-600">Heavy rainfall expected</p>
                                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                        Active
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthorityDashboard;