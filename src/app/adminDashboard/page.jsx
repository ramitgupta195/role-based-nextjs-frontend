"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import { getUsers, deleteUser } from "../../services/api";

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState([]);

  // Fetch users
  useEffect(() => {
    async function fetchUsers() {
      try {
        const token = localStorage.getItem("token");
        const data = await getUsers(token);
        const filtered = data.filter(
          (u) => !(u.roles && u.roles.includes("super_admin"))
        );
        setUsers(filtered);
      } catch (err) {
        console.error("Failed to fetch users:", err.message);
      }
    }

    fetchUsers();
  }, []);

  // Delete user
  const handleDelete = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await deleteUser(id, token);
      // Remove from local state
      setUsers(users.filter((u) => u.id !== id));
      alert("User deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete user");
    }
  };

  // Edit user
  const handleEdit = (id) => {
    router.push(`/edit-user/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

        <div className="overflow-x-auto rounded-lg border border-white/20 backdrop-blur-md">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white/10 text-white">
              <tr>
                <th className="py-3 px-4">Avatar</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-t border-white/10 hover:bg-white/5 transition"
                  >
                    <td className="py-3 px-4">
                      {u.profile_photo_url ? (
                        <img
                          src={
                            u.profile_photo_url.startsWith("/rails")
                              ? `${
                                  process.env.NEXT_PUBLIC_API_URL ||
                                  "http://localhost:3000"
                                }${u.profile_photo_url}`
                              : u.profile_photo_url
                          }
                          alt={u.email}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center font-bold">
                          {u.email.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">{u.name || "N/A"}</td>
                    <td className="py-3 px-4">{u.email}</td>
                    <td className="py-3 px-4">
                      {u.roles && u.roles.length > 0
                        ? u.roles.join(", ")
                        : "No role"}
                    </td>
                    <td className="py-3 px-4 flex gap-3">
                      <button
                        onClick={() => handleEdit(u.id)}
                        className="text-blue-400 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(u.id)}
                        className="text-red-400 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="text-center py-6 text-white/60 italic"
                  >
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
