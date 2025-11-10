'use client'
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import axios from "axios";
import EnhancedNavbar from "@/components/EnhancedNavbar";
import Footer from "@/components/Footer";

const About = () => {
  const bioRef = useRef(null);
  const heroRef = useRef(null);
  const missionRef = useRef(null);
  const howItWorksRef = useRef(null);
  const verifiedRef = useRef(null);
  const impactRef = useRef(null);
  const ctaRef = useRef(null);

  const bioInView = useInView(bioRef, { once: true, margin: "-100px" });
  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const missionInView = useInView(missionRef, { once: true, margin: "-100px" });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const verifiedInView = useInView(verifiedRef, { once: true, margin: "-100px" });
  const impactInView = useInView(impactRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const [impactStats, setImpactStats] = useState({
    totalOrganizations: 0,
    totalProductsDonated: 0,
    totalUsers: 0,
    totalCities: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/stats/public');
        if (response.data.success) {
          setImpactStats(response.data.stats);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <EnhancedNavbar />
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-16">
        {/* Floating Gradient Orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-pink-400/20 to-purple-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, 100, 0],
              y: [0, -50, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div
            className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-indigo-400/20 rounded-full blur-3xl"
            animate={{
              x: [0, -80, 0],
              y: [0, 60, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>

        <div className="relative z-10 px-6 md:px-16 lg:px-32 py-20">
          <div className="max-w-4xl mx-auto">
            {/* Bio Section */}
            <motion.div
              ref={bioRef}
              initial={{ opacity: 0, y: 50 }}
              animate={bioInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8 }}
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-12 shadow-lg border border-pink-100 relative overflow-hidden"
            >
              {/* Decorative gradient background */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-500 to-purple-600" />
              
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-8">
                {/* Profile Picture */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={bioInView ? { scale: 1, opacity: 1 } : { scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex-shrink-0"
                >
                  <div className="relative">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-pink-300 shadow-xl ring-4 ring-pink-100">
                      <img 
                        src="/headshot.jpg" 
                        alt="Sudharshini Ram - Founder of GirlsWhoGive"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to placeholder if image not found
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-pink-200 to-purple-200 hidden items-center justify-center">
                        <span className="text-4xl md:text-5xl">👤</span>
                      </div>
                    </div>
                    <motion.div
                      className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <span className="text-white text-sm">✨</span>
                    </motion.div>
                  </div>
                </motion.div>
                {/* Bio Content */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={bioInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                  className="flex-1 text-center md:text-left"
                >
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    About the <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Founder</span>
                  </h2>
                  <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                    I'm <span className="font-semibold text-pink-600">Sudharshini Ram</span>, and I believe that dignity is a basic human right. My journey as a passionate advocate for girls and women opened my eyes to a widespread and hidden crisis: period poverty. This mission became deeply personal when I saw how this one issue could be a major barrier to a person's education, work, and sense of self-worth.
                  </p>
                  <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mt-4">
                    I started by mobilizing my own community, organizing drives that successfully collected and donated over <span className="font-bold text-purple-600">1,200 feminine hygiene products</span> to women's shelters. That experience taught me two things: people are incredibly generous, but the logistics of getting donations to the right places, at the right time, is a huge challenge. I created this app to solve that exact problem. It's a bridge, connecting the generosity in our communities directly to the shelters that need it most. Together, we can end period poverty and restore dignity to countless women in need.
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Hero Section */}
            <motion.div
              ref={heroRef}
              initial={{ opacity: 0, y: 30 }}
              animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <motion.h1
                initial={{ opacity: 0, scale: 0.9 }}
                animate={heroInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 mb-6"
              >
                About <motion.span
                  className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600"
                  animate={{
                    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  style={{
                    backgroundSize: '200% 200%'
                  }}
                >
                  GirlsWhoGive
                </motion.span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-lg sm:text-xl md:text-2xl text-gray-600 leading-relaxed"
              >
                We're on a mission to end period poverty by connecting compassionate donors 
                with organizations that serve women in need.
              </motion.p>
              <motion.div
                initial={{ width: 0 }}
                animate={heroInView ? { width: '100px' } : { width: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full mx-auto mt-6"
              />
            </motion.div>

            {/* Mission Section */}
            <motion.div
              ref={missionRef}
              initial={{ opacity: 0, y: 50 }}
              animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8 }}
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-12 shadow-lg border border-pink-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">Our Mission</h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mb-6">
                We believe that access to menstrual products is a <span className="font-semibold text-pink-600">fundamental right, not a privilege</span>. 
                Period poverty affects millions of women and girls worldwide, forcing them to choose 
                between basic necessities and essential hygiene products.
              </p>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
                GirlsWhoGive bridges the gap between generous donors and organizations serving 
                women's shelters, community health centers, and nonprofits. Together, we're creating 
                a world where no woman has to face period poverty alone.
              </p>
            </motion.div>

            {/* How It Works */}
            <motion.div
              ref={howItWorksRef}
              initial={{ opacity: 0, y: 50 }}
              animate={howItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8 }}
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-12 shadow-lg border border-pink-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8">How It Works</h2>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: '★', title: 'Find Organizations', desc: 'Discover verified nonprofits and women\'s shelters in your area that accept menstrual product donations.', gradient: 'from-pink-500 to-rose-500' },
                  { icon: '♥', title: 'Make Donations', desc: 'Place orders for menstrual products that go directly to organizations serving women in need in your community.', gradient: 'from-purple-500 to-violet-500' },
                  { icon: '✔', title: 'Track Impact', desc: 'See how your donations make a real difference in your community and help end period poverty.', gradient: 'from-indigo-500 to-blue-500' }
                ].map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 30 }}
                    animate={howItWorksInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="text-center group"
                  >
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className={`w-20 h-20 bg-gradient-to-br ${item.gradient} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl transition-shadow`}
                    >
                      <span className="text-3xl text-white">{item.icon}</span>
                    </motion.div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Verified Organizations */}
            <motion.div
              ref={verifiedRef}
              initial={{ opacity: 0, y: 50 }}
              animate={verifiedInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8 }}
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-12 shadow-lg border border-pink-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-6">Verified Organizations</h2>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-6">
                Organizations with a ✓ checkmark are verified partners who have completed our 
                rigorous registration process. This ensures that:
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  ['They are legitimate nonprofit organizations', 'They serve underserved communities', 'They have proper documentation and tax status'],
                  ['They can receive direct product donations', 'They maintain proper donation records', 'They provide regular impact updates']
                ].map((column, colIndex) => (
                  <div key={colIndex} className="space-y-4">
                    {column.map((item, index) => (
                      <motion.div
                        key={item}
                        initial={{ opacity: 0, x: -20 }}
                        animate={verifiedInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                        transition={{ duration: 0.5, delay: colIndex * 0.3 + index * 0.1 }}
                        className="flex items-start gap-3"
                      >
                        <motion.span
                          className="text-green-600 text-xl"
                          initial={{ scale: 0 }}
                          animate={verifiedInView ? { scale: 1 } : { scale: 0 }}
                          transition={{ duration: 0.3, delay: colIndex * 0.3 + index * 0.1 + 0.2 }}
                        >
                          ✓
                        </motion.span>
                        <p className="text-gray-700">{item}</p>
                      </motion.div>
                    ))}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Impact Statistics - This will use the same StatsSection component from home */}
            <motion.div
              ref={impactRef}
              initial={{ opacity: 0, y: 50 }}
              animate={impactInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8 }}
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 md:p-12 mb-12 shadow-lg border border-pink-100 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-500 to-purple-600" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-8">Our Impact</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {[
                  { value: impactStats.totalOrganizations, label: 'Organizations', color: 'text-pink-600' },
                  { value: impactStats.totalProductsDonated, label: 'Products Donated', color: 'text-purple-600' },
                  { value: impactStats.totalUsers, label: 'Active Donors', color: 'text-pink-600' },
                  { value: impactStats.totalCities, label: 'Cities', color: 'text-purple-600' }
                ].map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={impactInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="text-center"
                  >
                    <motion.div
                      className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}
                      initial={{ opacity: 0 }}
                      animate={impactInView ? { opacity: 1 } : { opacity: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
                    >
                      {stat.value.toLocaleString()}+
                    </motion.div>
                    <div className="text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Call to Action */}
            <motion.div
              ref={ctaRef}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={ctaInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-r from-pink-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center text-white shadow-lg relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-700 to-purple-700 opacity-0 hover:opacity-100 transition-opacity duration-300" />
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 relative z-10"
              >
                Ready to Make a Difference?
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg sm:text-xl mb-8 opacity-90 relative z-10"
              >
                Join our community of compassionate donors and help end period poverty in your area.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={ctaInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
              >
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/user-dashboard'}
                  className="bg-white text-pink-600 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:bg-gray-100 transition-colors shadow-lg"
                >
                  Start Donating
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => window.location.href = '/organization-dashboard'}
                  className="bg-purple-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg hover:bg-purple-800 transition-colors border border-white/30 shadow-lg"
                >
                  Join as Organization
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default About;













