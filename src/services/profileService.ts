import { Profile } from '../features/profile/profileSlice';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const profileService = {
  async getProfile(): Promise<Profile> {
    await delay(400);
    const user = localStorage.getItem('user');
    if (!user) throw new Error('No profile found');
    return JSON.parse(user) as Profile;
  },

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    await delay(600);
    const existing = localStorage.getItem('user');
    if (!existing) throw new Error('No profile found');
    const updated: Profile = { ...JSON.parse(existing), ...data };
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  },

  async uploadAvatar(file: File): Promise<string> {
    await delay(800);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        resolve(base64);
      };
      reader.readAsDataURL(file);
    });
  },
};