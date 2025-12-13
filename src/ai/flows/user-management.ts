
'use server';
import { ai } from '@/ai/genkit';
import { z } from 'zod';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin SDK if not already initialized
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const auth = admin.auth();

const CreateReporterInputSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  title: z.string(),
  dob: z.string(),
  officeLocation: z.string(),
  profilePictureUrl: z.string().url().optional(),
});

export const createReporter = ai.defineFlow(
  {
    name: 'createReporter',
    inputSchema: CreateReporterInputSchema,
    outputSchema: z.object({ authorId: z.string() }),
  },
  async (reporterData) => {
    
    const authorRef = db.collection('authors').doc();
    
    await authorRef.set({
      id: authorRef.id,
      firstName: reporterData.firstName,
      lastName: reporterData.lastName,
      email: reporterData.email,
      title: reporterData.title,
      dob: reporterData.dob,
      officeLocation: reporterData.officeLocation,
      profilePictureUrl: reporterData.profilePictureUrl || `https://avatar.vercel.sh/${reporterData.email}.png`,
      verified: true,
      joinedDate: new Date().toLocaleDateString('en-CA') // YYYY-MM-DD
    });

    return { authorId: authorRef.id };
  }
);


const UpdateUserRoleInputSchema = z.object({
    userId: z.string(),
    role: z.enum(['member', 'reporter', 'editor', 'director']),
});

export const updateUserRole = ai.defineFlow(
    {
        name: 'updateUserRole',
        inputSchema: UpdateUserRoleInputSchema,
        outputSchema: z.object({ success: z.boolean() }),
    },
    async ({ userId, role }) => {
        const userRef = db.collection('users').doc(userId);
        const roleRef = db.collection('roles').doc(userId);

        const batch = db.batch();
        batch.set(userRef, { role: role }, { merge: true });
        batch.set(roleRef, { role: role }, { merge: true });
        
        await batch.commit();

        // Also set custom claim for backend security
        await auth.setCustomUserClaims(userId, { role });

        return { success: true };
    }
);


const DeleteUserInputSchema = z.object({
  userId: z.string(),
});

export const deleteUser = ai.defineFlow(
    {
        name: 'deleteUser',
        inputSchema: DeleteUserInputSchema,
        outputSchema: z.object({ success: z.boolean() }),
    },
    async ({ userId }) => {
        // Delete from Firebase Authentication
        await auth.deleteUser(userId);

        // Delete from Firestore
        const userRef = db.collection('users').doc(userId);
        const roleRef = db.collection('roles').doc(userId);
        
        const batch = db.batch();
        batch.delete(userRef);
        batch.delete(roleRef);
        
        await batch.commit();

        return { success: true };
    }
)
