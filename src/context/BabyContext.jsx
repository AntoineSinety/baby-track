import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getUserBabies, getBaby } from '../firebase/babies';

const BabyContext = createContext();

export const useBaby = () => {
  const context = useContext(BabyContext);
  if (!context) {
    throw new Error('useBaby must be used within BabyProvider');
  }
  return context;
};

export const BabyProvider = ({ children }) => {
  const { user } = useAuth();
  const [babies, setBabies] = useState([]);
  const [activeBaby, setActiveBaby] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger les bébés de l'utilisateur
  useEffect(() => {
    const loadBabies = async () => {
      if (!user) {
        setBabies([]);
        setActiveBaby(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const userBabies = await getUserBabies(user.uid);
        setBabies(userBabies);

        // Charger le dernier bébé actif depuis localStorage ou prendre le premier
        const savedBabyId = localStorage.getItem('activeBabyId');
        if (savedBabyId && userBabies.find(b => b.id === savedBabyId)) {
          const baby = await getBaby(savedBabyId);
          setActiveBaby(baby);
        } else if (userBabies.length > 0) {
          setActiveBaby(userBabies[0]);
          localStorage.setItem('activeBabyId', userBabies[0].id);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des bébés:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBabies();
  }, [user]);

  // Changer de bébé actif
  const switchBaby = async (babyId) => {
    try {
      const baby = await getBaby(babyId);
      setActiveBaby(baby);
      localStorage.setItem('activeBabyId', babyId);
    } catch (error) {
      console.error('Erreur lors du changement de bébé:', error);
    }
  };

  // Rafraîchir la liste des bébés
  const refreshBabies = async () => {
    if (!user) return;

    try {
      const userBabies = await getUserBabies(user.uid);
      setBabies(userBabies);

      // Mettre à jour le bébé actif si nécessaire
      if (activeBaby) {
        const updatedBaby = userBabies.find(b => b.id === activeBaby.id);
        if (updatedBaby) {
          setActiveBaby(updatedBaby);
        }
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des bébés:', error);
    }
  };

  const value = {
    babies,
    activeBaby,
    loading,
    switchBaby,
    refreshBabies
  };

  return <BabyContext.Provider value={value}>{children}</BabyContext.Provider>;
};
