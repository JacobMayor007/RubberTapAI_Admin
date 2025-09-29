const ProfileInfo = () => {
  return (
    <div className="rounded-xl bg-white p-6 shadow">
      <h2 className="mb-4 text-lg font-semibold">Account Details</h2>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">Username</p>
          <p className="font-medium text-gray-800">{admin.username}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Full Name</p>
          <p className="font-medium text-gray-800">{admin.name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Email</p>
          <p className="font-medium text-gray-800">{admin.email}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Role</p>
          <p className="font-medium text-gray-800">{admin.role}</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
