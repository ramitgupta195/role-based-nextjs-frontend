"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { getUsers, updateUser } from "../../../services/api";

export default function EditUserPage() {
  const router = useRouter();
  const { id } = useParams();
  const [userData, setUserData] = useState({
    email: "",
    name: "",
    password: "",
    password_confirmation: "",
    profile_photo: null,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const token = localStorage.getItem("token");
        const users = await getUsers(token);
        const user = users.find((u) => u.id === parseInt(id));
        if (!user) return alert("User not found");

        setUserData({
          email: user.email,
          name: user.name || "",
          password: "",
          password_confirmation: "",
          profile_photo: null,
        });
      } catch (err) {
        console.error(err);
        alert("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setUserData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updates = {
        email: userData.email,
        name: userData.name,
        password: userData.password || undefined,
        password_confirmation: userData.password_confirmation || undefined,
        profile_photo: userData.profile_photo || undefined,
      };

      await updateUser(id, updates, token);
      alert("User updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update user");
    }
  };

  if (loading) return <p className="text-white p-8">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Edit User</h2>

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={userData.name}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 text-white outline-none"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={userData.email}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 text-white outline-none"
        />
        <input
          type="password"
          name="password"
          placeholder="Password (leave blank to keep)"
          value={userData.password}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 text-white outline-none"
        />
        <input
          type="password"
          name="password_confirmation"
          placeholder="Confirm Password"
          value={userData.password_confirmation}
          onChange={handleChange}
          className="p-2 rounded bg-gray-700 text-white outline-none"
        />
        <input
          type="file"
          name="profile_photo"
          accept="image/*"
          onChange={handleChange}
          className="text-white"
        />

        <button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 py-2 rounded font-semibold transition"
        >
          Update User
        </button>
      </form>
    </div>
  );
}
