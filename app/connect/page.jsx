'use client'
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import EnhancedNavbar from "@/components/EnhancedNavbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useClerk } from "@clerk/nextjs";

const ConnectContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, userRole, createOrganization } = useAppContext();
  const { openSignIn, openSignUp } = useClerk();
  
  const [selectedRole, setSelectedRole] = useState(searchParams.get('role') || null);
  const [organizationForm, setOrganizationForm] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    description: '',
    website: '',
    taxId: ''
  });

  useEffect(() => {
    // If user is already logged in and has a role, redirect appropriately
    if (user && userRole) {
      if (userRole === 'donor') {
        router.push('/donor/discover');
      } else if (userRole === 'organization') {
        router.push('/organization/dashboard');
      } else if (userRole === 'admin') {
        router.push('/admin/dashboard');
      }
    }
  }, [user, userRole, router]);

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleSignUp = async () => {
    if (selectedRole === 'organization') {
      // For organizations, we need to collect additional info first
      if (!organizationForm.name || !organizationForm.address) {
        alert('Please fill in organization name and address');
        return;
      }
      localStorage.setItem('organizationData', JSON.stringify(organizationForm));
    }
    
    // Store the selected role in localStorage for after signup
    localStorage.setItem('selectedRole', selectedRole);
    openSignUp();
  };

  // const handleOrganizationRegistration = async () => {
  //   if (!organizationForm.name || !organizationForm.address) {
  //     alert('Please fill in organization name and address');
  //     return;
  //   }
    
  //   // Store organization data in localStorage for after signup
  //   localStorage.setItem('organizationData', JSON.stringify(organizationForm));
  //   localStorage.setItem('selectedRole', 'organization');
  //   openSignUp();
  // };

  const handleSignIn = () => {
    openSignIn();
  };

  const handleOrganizationFormChange = (field, value) => {
    setOrganizationForm(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <EnhancedNavbar />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 py-12 pt-16">
        <div className="max-w-4xl mx-auto px-6 md:px-16 lg:px-32">
          
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Connect with GirlsWhoGive
            </h1>
            <p className="text-lg text-gray-600">
              Choose your role and join our community
            </p>
          </div>

          {/* Role Selection */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-pink-100 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Role</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <button
                onClick={() => handleRoleSelect('donor')}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedRole === 'donor'
                    ? 'border-pink-500 bg-pink-50'
                    : 'border-gray-200 hover:border-pink-300'
                }`}
              >
                <div className="text-4xl mb-4">👤</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Donor</h3>
                <p className="text-gray-600 text-sm">
                  Find organizations near you and make donation commitments
                </p>
              </button>

              <button
                onClick={() => handleRoleSelect('organization')}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedRole === 'organization'
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
              >
                <div className="text-4xl mb-4">🏢</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Organization</h3>
                <p className="text-gray-600 text-sm">
                  Receive donations and track your impact in the community
                </p>
              </button>

              <button
                onClick={() => handleRoleSelect('admin')}
                className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                  selectedRole === 'admin'
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300'
                }`}
              >
                <div className="text-4xl mb-4">👨‍💼</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Administrator</h3>
                <p className="text-gray-600 text-sm">
                  Manage platform operations and organization verification
                </p>
              </button>
            </div>
          </div>

          {/* Organization Form */}
          {selectedRole === 'organization' && (
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-pink-100 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Organization Information</h2>
              <p className="text-gray-600 mb-6">
                Please provide your organization details. This information will be used for verification.
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Name *
                  </label>
                  <input
                    type="text"
                    value={organizationForm.name}
                    onChange={(e) => handleOrganizationFormChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Your organization name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    value={organizationForm.address}
                    onChange={(e) => handleOrganizationFormChange('address', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Full address"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={organizationForm.phone}
                    onChange={(e) => handleOrganizationFormChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={organizationForm.email}
                    onChange={(e) => handleOrganizationFormChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="contact@organization.org"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    value={organizationForm.website}
                    onChange={(e) => handleOrganizationFormChange('website', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="https://www.organization.org"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tax ID / EIN
                  </label>
                  <input
                    type="text"
                    value={organizationForm.taxId}
                    onChange={(e) => handleOrganizationFormChange('taxId', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="12-3456789"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Organization Description
                  </label>
                  <textarea
                    value={organizationForm.description}
                    onChange={(e) => handleOrganizationFormChange('description', e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Describe your organization's mission and the communities you serve..."
                  />
                </div>
              </div>
            </div>
          )}

          {/* Authentication Actions */}
          {selectedRole && (
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-lg border border-pink-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedRole === 'donor' ? 'Join as a Donor' : 
                 selectedRole === 'organization' ? 'Register Your Organization' : 
                 'Administrator Access'}
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleSignUp}
                  className={`px-8 py-4 rounded-2xl font-semibold text-lg transition-all duration-300 ${
                    selectedRole === 'donor' 
                      ? 'bg-pink-600 text-white hover:bg-pink-700' :
                    selectedRole === 'organization'
                      ? 'bg-purple-600 text-white hover:bg-purple-700' :
                      'bg-indigo-600 text-white hover:bg-indigo-700'
                  }`}
                >
                  {selectedRole === 'admin' ? 'Request Admin Access' : 'Create Account'}
                </button>
                
                <button
                  onClick={handleSignIn}
                  className="px-8 py-4 rounded-2xl font-semibold text-lg border-2 border-gray-300 text-gray-700 hover:border-pink-500 hover:text-pink-600 transition-all duration-300"
                >
                  Sign In
                </button>
              </div>

              {selectedRole === 'organization' && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> Organizations are automatically verified upon registration. 
                    You'll be able to receive donations immediately after account creation.
                  </p>
                </div>
              )}

              {selectedRole === 'admin' && (
                <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    <strong>Note:</strong> Administrator access requires approval from platform administrators. 
                    Contact the platform team for access.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center mt-8">
            <button
              onClick={() => router.push('/')}
              className="text-gray-600 hover:text-gray-900 transition-colors underline"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

const Connect = () => {
  return (
    <Suspense fallback={
      <>
        <EnhancedNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-16">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
        <Footer />
      </>
    }>
      <ConnectContent />
    </Suspense>
  );
};

export default Connect;



