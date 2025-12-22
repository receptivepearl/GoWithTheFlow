'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import EnhancedNavbar from "@/components/EnhancedNavbar";
import Footer from "@/components/Footer";
import OrganizationNeedsModal from "@/components/OrganizationNeedsModal";
import { useAppContext } from "@/context/AppContext";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";

const AdminOrganizationNeedsPage = () => {
  const router = useRouter();
  const { user, userRole } = useAppContext();
  const { getToken } = useAuth();
  const [needs, setNeeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNeed, setSelectedNeed] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/connect?role=admin');
      return;
    }
    if (userRole && userRole !== 'admin') {
      router.push('/');
      return;
    }
  }, [user, userRole, router]);

  useEffect(() => {
    const fetchNeeds = async () => {
      try {
        const response = await axios.get('/api/organization-needs');
        if (response.data.success) {
          setNeeds(response.data.needs);
        }
      } catch (error) {
        console.error('Error fetching organization needs:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user && userRole === 'admin') {
      fetchNeeds();
    }
  }, [user, userRole]);

  const handleCardClick = (need) => {
    setSelectedNeed(need);
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setSelectedNeed({
      organizationName: '',
      description: '',
      requiredItems: [{ name: '', notes: '' }]
    });
    setIsAddModalOpen(true);
  };

  const handleSave = async (needData) => {
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      if (needData._id) {
        // Update existing
        const response = await axios.put(
          '/api/organization-needs',
          {
            id: needData._id,
            organizationName: needData.organizationName,
            description: needData.description,
            requiredItems: needData.requiredItems
          },
          { headers }
        );
        if (response.data.success) {
          setNeeds(needs.map(n => n._id === needData._id ? response.data.need : n));
          setIsModalOpen(false);
          setIsAddModalOpen(false);
          setSelectedNeed(null);
        }
      } else {
        // Create new
        const response = await axios.post(
          '/api/organization-needs',
          {
            organizationName: needData.organizationName,
            description: needData.description,
            requiredItems: needData.requiredItems
          },
          { headers }
        );
        if (response.data.success) {
          setNeeds([...needs, response.data.need]);
          setIsAddModalOpen(false);
          setSelectedNeed(null);
        }
      }
    } catch (error) {
      console.error('Error saving organization need:', error);
      alert('Error saving organization need. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = await getToken();
      const headers = { Authorization: `Bearer ${token}` };

      const response = await axios.delete(`/api/organization-needs?id=${id}`, { headers });
      if (response.data.success) {
        setNeeds(needs.filter(n => n._id !== id));
      }
    } catch (error) {
      console.error('Error deleting organization need:', error);
      alert('Error deleting organization need. Please try again.');
    }
  };

  return (
    <>
      <EnhancedNavbar />
      <div 
        className="relative min-h-screen pt-16"
        style={{
          backgroundImage: 'url(/background/BackgroundUI.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          minHeight: '100vh'
        }}
      >
        <div className="relative z-10 px-6 md:px-16 lg:px-32 py-20">
          <div className="max-w-6xl mx-auto">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between mb-12">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  Organization Needs
                </h1>
                <p className="text-lg text-gray-600">
                  Manage what organizations currently need
                </p>
              </div>
              <button
                onClick={handleAddNew}
                className="flex items-center gap-2 bg-pink-600 text-white px-6 py-3 rounded-2xl font-semibold hover:bg-pink-700 transition-colors shadow-lg"
                title="Add New Organization Need"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add New
              </button>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-pink-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading organization needs...</p>
              </div>
            ) : needs.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No organization needs listed</h3>
                <p className="text-gray-600 mb-6">Click "Add New" to create the first organization need.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {needs.map((need) => (
                  <div
                    key={need._id}
                    onClick={() => handleCardClick(need)}
                    className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg border border-pink-100 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {need.organizationName}
                    </h3>
                    {need.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {need.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-pink-600">
                      <span className="text-sm font-medium">
                        {need.requiredItems.length} item{need.requiredItems.length !== 1 ? 's' : ''} needed
                      </span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* View/Edit Modal */}
      <OrganizationNeedsModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedNeed(null);
        }}
        organizationNeed={selectedNeed}
        isAdmin={true}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      {/* Add New Modal */}
      <OrganizationNeedsModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setSelectedNeed(null);
        }}
        organizationNeed={selectedNeed}
        isAdmin={true}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      <Footer />
    </>
  );
};

export default AdminOrganizationNeedsPage;

