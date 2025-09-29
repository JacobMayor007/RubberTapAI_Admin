import React, { useState } from "react";
import Button from "../ui/Button";

const ChangePasswordForm: React.FC = () => {
  const [current, setCurrent] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirm) {
      alert("Passwords do not match!");
      return;
    }
    console.log("Change password:", { current, newPass });
    alert("Password changed successfully!");
    setCurrent("");
    setNewPass("");
    setConfirm("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl bg-white p-6 shadow"
    >
      <h2 className="mb-2 text-lg font-semibold">Change Password</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Current Password
        </label>
        <input
          type="password"
          required
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          New Password
        </label>
        <input
          type="password"
          required
          value={newPass}
          onChange={(e) => setNewPass(e.target.value)}
          className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Confirm New Password
        </label>
        <input
          type="password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="mt-1 w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <Button type="submit" className="w-full">
        Save
      </Button>
    </form>
  );
};

export default ChangePasswordForm;
