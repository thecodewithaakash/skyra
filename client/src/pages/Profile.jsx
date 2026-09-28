import { Link, useNavigate } from "react-router";
import { useState } from "react";
import useApi from "../api/api";
import useAuthContext from "../context/useAuthContext";

const Profile = () => {
  const navigate = useNavigate();
  const api = useApi();
  const { user, isUserLoading, setAccessToken, setUser } = useAuthContext();
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleLogout = async () => {
    setLogoutLoading(true);
    setLogoutError("");

    try {
      await api.post("/auth/logout");
      setAccessToken(null);
      setUser(null);
      navigate("/login");
    } catch (error) {
      setLogoutError(
        error.response?.data?.message || "Unable to log out. Please try again.",
      );
    } finally {
      setLogoutLoading(false);
    }
  };

  if (isUserLoading) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-gray-50">
        <p className="text-sm text-gray-500">Loading your profile...</p>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center bg-gray-50 px-5 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Sign in to view your profile</h1>
        <p className="mt-2 text-sm text-gray-500">
          Your account details will appear here after you sign in.
        </p>
        <Link
          to="/login"
          className="mt-5 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-gray-700"
        >
          Sign In
        </Link>
      </main>
    );
  }

  const profile = user;

  const isSeller = profile.role === "seller";

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-5 py-12">

        {/* Header */}
        <div>
          <p className="text-sm font-medium text-indigo-600">
            Account
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
            My Profile
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your account information and preferences.
          </p>
        </div>

        {/* Profile Card */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

          {/* Profile Header */}
          <div className="border-b border-gray-200 px-6 py-8 sm:px-8">
            <div className="flex flex-col items-center gap-5 sm:flex-row">

              {/* Avatar */}
              <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-100">
                {profile.profilePic ? (
                  <img
                    src={profile.profilePic}
                    alt={profile.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-3xl font-bold text-indigo-600">
                    {profile.name?.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              {/* Name */}
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-gray-900">
                  {profile.name}
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  {profile.email}
                </p>

                <span className="mt-3 inline-flex rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium capitalize text-indigo-600">
                  {profile.role}
                </span>
              </div>

            </div>
          </div>

          {/* Account Information */}
          <div className="px-6 py-8 sm:px-8">
            <h3 className="text-lg font-semibold text-gray-900">
              Account Information
            </h3>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">

              {/* Name */}
              <div>
                <p className="text-sm text-gray-500">
                  Full Name
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {profile.name}
                </p>
              </div>

              {/* Email */}
              <div>
                <p className="text-sm text-gray-500">
                  Email Address
                </p>

                <p className="mt-1 font-medium text-gray-900">
                  {profile.email}
                </p>
              </div>

              {/* Role */}
              <div>
                <p className="text-sm text-gray-500">
                  Account Type
                </p>

                <p className="mt-1 font-medium capitalize text-gray-900">
                  {profile.role}
                </p>
              </div>

              {/* Account Status */}
              <div>
                <p className="text-sm text-gray-500">
                  Account Status
                </p>

                <p className="mt-1 flex items-center gap-2 font-medium text-green-600">
                  <span className="h-2 w-2 rounded-full bg-green-500" />
                  Active
                </p>
              </div>

            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-gray-200 bg-gray-50 px-6 py-5 sm:flex-row sm:px-8">

            <button
              type="button"
              className="rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              Edit Profile
            </button>

            {isSeller && (
              <Link
                to="/dashboard"
                className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-center text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                Seller Dashboard
              </Link>
            )}

            <button
              type="button"
              onClick={handleLogout}
              disabled={logoutLoading}
              className="rounded-lg border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              {logoutLoading ? "Logging out..." : "Logout"}
            </button>

          </div>
          {logoutError && (
            <p className="px-6 pb-5 text-sm text-red-600 sm:px-8">
              {logoutError}
            </p>
          )}
        </div>

      </div>
    </main>
  );
};

export default Profile;
