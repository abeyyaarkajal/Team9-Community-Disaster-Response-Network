import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Shield, Users, Radio } from 'lucide-react';

const Home = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-600 to-blue-800">
            <div className="container mx-auto px-4 py-20">
                <div className="text-center text-white">
                    <AlertTriangle size={80} className="mx-auto mb-6 animate-pulse" />
                    <h1 className="text-5xl font-bold mb-4">
                        Community Disaster Response Network
                    </h1>
                    <p className="text-xl mb-8 text-blue-100">
                        Real-time disaster management platform connecting citizens, volunteers, and authorities
                    </p>

                    <div className="flex gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-50 transition"
                        >
                            Get Started
                        </Link>
                        <Link
                            to="/login"
                            className="bg-blue-700 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-blue-600 transition border-2 border-white"
                        >
                            Login
                        </Link>
                    </div>
                </div>

                <div className="grid md:grid-cols-4 gap-6 mt-20">
                    <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                        <Shield size={48} className="mx-auto text-green-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Mitigation</h3>
                        <p className="text-gray-600">Hazard mapping and risk assessment</p>
                        <div className="text-green-600 font-bold mt-2">20%</div>
                    </div>

                    <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                        <Radio size={48} className="mx-auto text-yellow-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Preparedness</h3>
                        <p className="text-gray-600">Early warnings and alerts</p>
                        <div className="text-yellow-600 font-bold mt-2">25%</div>
                    </div>

                    <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                        <AlertTriangle size={48} className="mx-auto text-red-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Response</h3>
                        <p className="text-gray-600">Real-time incident reporting</p>
                        <div className="text-red-600 font-bold mt-2">40%</div>
                    </div>

                    <div className="bg-white rounded-lg p-6 text-center shadow-lg">
                        <Users size={48} className="mx-auto text-blue-600 mb-4" />
                        <h3 className="text-xl font-bold mb-2">Recovery</h3>
                        <p className="text-gray-600">Damage assessment and relief</p>
                        <div className="text-blue-600 font-bold mt-2">15%</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
