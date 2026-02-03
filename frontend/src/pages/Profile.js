import { useAuth } from "../context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-black text-white px-8 py-16">
      <h1 className="text-4xl font-bold mb-6">Your Profile</h1>

      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-xl">
        <p className="text-gray-400 mb-2">Email</p>
        <p className="text-lg">{user?.email}</p>

        <p className="text-gray-400 mt-6 mb-2">Account Type</p>
        <p className="text-lg">Free User</p>
      </div>
    </div>
  );
};

export default Profile;
