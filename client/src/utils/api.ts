import axios from "axios";

export interface User {
  id: string;
  email: string;
  role: string;
  firstName: string;
}

export interface Pet {
  id: number;
  name: string;
  category: string;
  age: string;
  city: string;
  image?: string;
  description?: string;
  images?: string[];
}

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

API.interceptors.request.use((cfg) => {
  const t = localStorage.getItem("token");
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; token: string }> {
  return new Promise((res) =>
    setTimeout(
      () =>
        res({
          user: { id: "u1", email, role: "pet_seeker", firstName: "User" },
          token: "demo-token",
        }),
      300
    )
  );
}

export async function registerUser(payload: {
  email: string;
  password: string;
  role?: string;
  firstName?: string;
}): Promise<{ user: User; token: string }> {
  return new Promise((res) =>
    setTimeout(
      () =>
        res({
          user: {
            id: "u2",
            email: payload.email,
            role: payload.role || "pet_seeker",
            firstName: payload.firstName || "User",
          },
          token: "demo-token",
        }),
      300
    )
  );
}

export async function fetchPets(
  filters: Record<string, any> = {}
): Promise<Pet[]> {
  return [
    {
      id: 1,
      name: "Buddy",
      category: "Dog",
      age: "2y",
      city: "Baku",
      image: "https://placehold.co/600x400?text=Dog+1",
      description: "Friendly and playful.",
    },
    {
      id: 2,
      name: "Whiskers",
      category: "Cat",
      age: "1y",
      city: "Ganja",
      image: "https://placehold.co/600x400?text=Cat+1",
      description: "Calm and lovely.",
    },
  ];
}

export async function fetchPetById(id: number): Promise<Pet> {
  return {
    id,
    name: "Buddy",
    category: "Dog",
    images: [
      "https://placehold.co/800x500?text=Dog+Main",
      "https://placehold.co/400x300?text=Dog+2",
      "https://placehold.co/400x300?text=Dog+3",
    ],
    description: "Very friendly, healthy and vaccinated.",
    age: "2 years",
    city: "Baku",
  };
}

export async function addPet(pet: Pet): Promise<Pet> {
  return pet;
}

export async function updatePet(id: number, pet: Pet): Promise<Pet> {
  return { ...pet, id };
}

export async function deletePet(id: number): Promise<{ success: boolean }> {
  return { success: true };
}

export async function getMyPets(): Promise<Pet[]> {
  return [
    {
      id: 10,
      name: "Rex",
      category: "Dog",
      age: "3y",
      city: "Baku",
      image: "https://placehold.co/400x300?text=Rex",
    },
    {
      id: 11,
      name: "Mia",
      category: "Cat",
      age: "8m",
      city: "Sumgait",
      image: "https://placehold.co/400x300?text=Mia",
    },
  ];
}


export async function getCurrentUser(): Promise<User | null> {
  const token = localStorage.getItem("token");
  if (!token) return null;


  return {
    id: "u1",
    email: "demo@example.com",
    role: "pet_seeker",
    firstName: "Demo",
  };
}


export async function logoutUser(): Promise<void> {
  localStorage.removeItem("token");
}
