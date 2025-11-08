'use client'
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import { useUser, useAuth } from "@clerk/nextjs";
import axios from "axios";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {
    const router = useRouter()
    const { user } = useUser()
    const { getToken } = useAuth()

    const [userData, setUserData] = useState(null)
    const [userRole, setUserRole] = useState(null)
    const [organizations, setOrganizations] = useState([])
    const [donations, setDonations] = useState([])
    const [loading, setLoading] = useState(false)

    const fetchUserData = async () => {
        if (!user) return;
        
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/user/data', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                setUserData(data.user)
                setUserRole(data.user.role || 'donor')
            } else {
                // If user doesn't exist in database, create them
                const selectedRole = localStorage.getItem('selectedRole') || 'donor';
                
                await createUser(selectedRole);
                
                const orgData = localStorage.getItem('organizationData');

                // If organization role, create organization profile
                if (selectedRole === 'organization' && orgData) {
                    
                    const organizationData = JSON.parse(orgData);
                                                                
                    if (Object.keys(organizationData).length > 0) { 
                        
                        console.log("APPCONTEXT: Attempting POST /api/organizations/create with data:", organizationData); // <-- New Debug Log
                        
                        try {
                            // Run the creation API call
                            await createOrganization(organizationData); 
                            toast.success('Organization profile saved!');

                        } catch (e) {
                            console.error('Failed to create organization profile:', e);
                            toast.error('Failed to save organization details.');
                        }
                    } else {
                        console.error('APPCONTEXT: organizationData in localStorage was empty {}.');
                    }
                    localStorage.removeItem('organizationData');   
                }
            }
        } catch (error) {
            const selectedRole = localStorage.getItem('selectedRole') || 'donor';
            await createUser(selectedRole);
            localStorage.removeItem('selectedRole');
            localStorage.removeItem('organizationData'); 
        }
    }

    const createUser = async (role = 'donor') => {
        if (!user) return;
        
        try {
            const token = await getToken()
            const userData = {
                clerkId: user.id,
                email: user.emailAddresses[0].emailAddress,
                firstName: user.firstName,
                lastName: user.lastName,
                role: role
            }

            const { data } = await axios.post('/api/user/create', userData, {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (data.success) {
                setUserData(data.user)
                setUserRole(role)
            }
        } catch (error) {
            console.error('Error creating user:', error)
            toast.error('Error setting up your account')
        }
    }

    // Removed fetchOrganizations - using dummy data for now

    const fetchDonations = async () => {
        if (!user || userRole !== 'donor') return;
        
        try {
            const token = await getToken()
            const { data } = await axios.get('/api/donations/user', {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                setDonations(data.donations)
            }
        } catch (error) {
            console.error('Error fetching donations:', error)
        }
    }

    const createDonation = async (donationData) => {
        try {
            const token = await getToken()
            const { data } = await axios.post('/api/donations/create', donationData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                toast.success('Donation commitment created successfully!')
                fetchDonations() // Refresh donations list
                return data.donation
            }
        } catch (error) {
            console.error('Error creating donation:', error)
            toast.error('Error creating donation commitment')
            throw error
        }
    }

    const createOrganization = async (organizationData) => {
        try {
            const token = await getToken()
            const { data } = await axios.post('/api/organizations/create', organizationData, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                // Update user role to organization
                setUserRole('organization')
                toast.success('Organization created successfully!')
                return data.organization
            }
        } catch (error) {
            console.error('Error creating organization:', error)
            toast.error('Error creating organization')
            throw error
        }
    }

    const cancelDonation = async (donationId) => {
        try {
            const token = await getToken()
            const { data } = await axios.put('/api/donations/cancel', { donationId }, {
                headers: { Authorization: `Bearer ${token}` }
            })
            if (data.success) {
                toast.success('Donation commitment cancelled successfully')
                fetchDonations() // Refresh donations list
                return data.donation
            }
        } catch (error) {
            console.error('Error cancelling donation:', error)
            toast.error(error.response?.data?.message || 'Error cancelling donation commitment')
            throw error
        }
    }

    useEffect(() => {
        if (user) {
            fetchUserData()
        } else {
            setUserData(null)
            setUserRole(null)
            setDonations([])
            setOrganizations([])
        }
    }, [user])

    useEffect(() => {
        if (userRole === 'donor') {
            fetchDonations()
        }
    }, [userRole])

    const value = {
        user, getToken,
        router,
        userData, userRole,
        organizations, donations,
        loading, setLoading,
        fetchUserData, createUser,
        fetchDonations, createDonation,
        createOrganization, cancelDonation
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
