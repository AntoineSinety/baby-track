import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDoc,
  getDocs,
  query,
  where,
  arrayUnion,
  arrayRemove,
  serverTimestamp,
  setDoc
} from 'firebase/firestore';
import { db } from './config';

/**
 * Structure des données :
 *
 * babies/{babyId}
 *   - name: string
 *   - birthDate: string (ISO)
 *   - photo: string (URL)
 *   - createdBy: string (userId)
 *   - members: array [{ userId, email, displayName, role: 'owner'|'editor' }]
 *   - createdAt: timestamp
 *   - updatedAt: timestamp
 *
 * babies/{babyId}/events/{eventId}
 *   - type: 'feeding' | 'diaper'
 *   - ... autres champs d'événement
 *   - addedBy: { userId, displayName }
 */

// Créer un nouveau profil bébé
export const createBaby = async (userId, userEmail, displayName, babyData) => {
  try {
    const babiesRef = collection(db, 'babies');
    const docRef = await addDoc(babiesRef, {
      ...babyData,
      createdBy: userId,
      memberIds: [userId], // Liste simple des IDs pour les requêtes
      members: [{
        userId,
        email: userEmail,
        displayName,
        role: 'owner'
      }],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Erreur lors de la création du bébé:', error);
    throw error;
  }
};

// Récupérer tous les bébés accessibles par l'utilisateur
export const getUserBabies = async (userId) => {
  try {
    const babiesRef = collection(db, 'babies');
    // Utiliser memberIds pour la requête (array-contains fonctionne avec des valeurs simples)
    const q = query(babiesRef, where('memberIds', 'array-contains', userId));

    const snapshot = await getDocs(q);
    const babies = [];

    snapshot.forEach((doc) => {
      babies.push({ id: doc.id, ...doc.data() });
    });

    return babies;
  } catch (error) {
    console.error('Erreur lors de la récupération des bébés:', error);
    throw error;
  }
};

// Récupérer un bébé spécifique
export const getBaby = async (babyId) => {
  try {
    const babyRef = doc(db, 'babies', babyId);
    const babyDoc = await getDoc(babyRef);

    if (babyDoc.exists()) {
      return { id: babyDoc.id, ...babyDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Erreur lors de la récupération du bébé:', error);
    throw error;
  }
};

// Mettre à jour les informations du bébé
export const updateBaby = async (babyId, babyData) => {
  try {
    const babyRef = doc(db, 'babies', babyId);
    await updateDoc(babyRef, {
      ...babyData,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du bébé:', error);
    throw error;
  }
};

// Ajouter un membre (parent) au profil bébé
export const addMemberToBaby = async (babyId, memberData) => {
  try {
    const babyRef = doc(db, 'babies', babyId);
    await updateDoc(babyRef, {
      memberIds: arrayUnion(memberData.userId), // Ajouter l'ID à la liste simple
      members: arrayUnion(memberData),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du membre:', error);
    throw error;
  }
};

// Retirer un membre du profil bébé
export const removeMemberFromBaby = async (babyId, memberData) => {
  try {
    const babyRef = doc(db, 'babies', babyId);
    await updateDoc(babyRef, {
      memberIds: arrayRemove(memberData.userId), // Retirer l'ID de la liste simple
      members: arrayRemove(memberData),
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Erreur lors du retrait du membre:', error);
    throw error;
  }
};

// Vérifier si l'utilisateur a accès à un bébé
export const hasAccessToBaby = async (babyId, userId) => {
  try {
    const baby = await getBaby(babyId);
    if (!baby) return false;

    return baby.members?.some(member => member.userId === userId);
  } catch (error) {
    console.error('Erreur lors de la vérification d\'accès:', error);
    return false;
  }
};

// Vérifier si l'utilisateur est propriétaire
export const isOwner = (baby, userId) => {
  return baby.members?.some(member =>
    member.userId === userId && member.role === 'owner'
  );
};
