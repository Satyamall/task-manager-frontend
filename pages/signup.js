import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { BASE_URL } from "../config/ApiConstant";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [avatar, setAvatar] = useState(null);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);
    formData.append("role", role);
    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      await axios.post(`${BASE_URL}/api/auth/signup`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      router.push("/login");
    } catch (error) {
      alert(
        "Signup failed: " + (error.response?.data?.message || "Unknown error")
      );
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Signup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-2 border rounded"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setAvatar(e.target.files[0])}
          className="w-full p-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded"
        >
          Signup
        </button>
      </form>
      <p className="mt-2">
        Already have an account?{" "}
        <a href="/login" className="text-blue-500">
          Log in
        </a>
      </p>
    </div>
  );
}
