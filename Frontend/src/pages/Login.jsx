import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { authAPI } from "../api/auth";

const Login = () => {
  const [credentials, setCredentials] = useState({
    Username: "",
    Password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login(credentials);
      if (!response.Token || !response.Username || !response.Role) {
        throw new Error("Invalid login response");
      }
      const userData = {
        username: response.Username,
        role: response.Role,
      };
      login(response.Token, userData);
      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          error.message ||
          "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 py-12 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-3xl font-extrabold text-center text-gray-900">
            EV Charging Management
          </h2>
          <p className="mt-2 text-sm text-center text-gray-600">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="px-4 py-3 text-red-700 border border-red-300 rounded bg-red-50">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="Username"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="Username"
                name="Username"
                type="text"
                required
                className="input-field"
                placeholder="Enter your username"
                value={credentials.Username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label
                htmlFor="Password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="Password"
                name="Password"
                type="password"
                required
                className="input-field"
                placeholder="Enter your password"
                value={credentials.Password}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              EV Owner?{" "}
              <a
                href="/ev-owner"
                className="text-primary-600 hover:text-primary-500"
              >
                Access EV Owner Portal
              </a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
