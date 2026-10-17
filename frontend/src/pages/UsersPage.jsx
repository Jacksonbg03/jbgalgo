import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Link } from "react-router";
import { CodeIcon, EyeIcon, EyeOffIcon, SaveIcon, SearchIcon, Trash2Icon } from "lucide-react";
import Navbar from "../components/Navbar";
import { useAdminUsers, useDeleteUserByAdmin, useGetUser, useUpdateUserByAdmin } from "../hooks/useUsers";

const FILTERS = [
  { value: "all", label: "All" },
  { value: "SMP", label: "SMP" },
  { value: "SMA", label: "SMA" },
  { value: "none", label: "No level" },
  { value: "hidden", label: "Hidden" },
];

function UserRow({ user, isSelf }) {
  const [name, setName] = useState(user.name);
  const [level, setLevel] = useState(user.level || "");
  const updateUser = useUpdateUserByAdmin();
  const deleteUser = useDeleteUserByAdmin();

  const isAdmin = user.role === "Admin";
  const changed = name.trim() !== user.name || level !== (user.level || "");
  const busy = updateUser.isPending || deleteUser.isPending;

  const onError = (err) => toast.error(err.response?.data?.message || "Something went wrong");

  const save = () =>
    updateUser.mutate(
      { id: user._id, name: name.trim(), level },
      { onSuccess: () => toast.success(`${name.trim()} updated`), onError }
    );

  const toggleHidden = () =>
    updateUser.mutate(
      { id: user._id, hidden: !user.hidden },
      { onSuccess: () => toast.success(user.hidden ? `${user.name} is visible again` : `${user.name} hidden`), onError }
    );

  const remove = () => {
    const ok = window.confirm(
      `Delete ${user.name} (${user.email})?\n\nThe account and all of its progress will be removed permanently and they will no longer be able to sign in. This cannot be undone.`
    );
    if (!ok) return;
    deleteUser.mutate(user._id, { onSuccess: () => toast.success(`${user.name} deleted`), onError });
  };

  return (
    <tr className={user.hidden ? "opacity-50" : ""}>
      <td className="min-w-48">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-sm bg-base-300 w-full"
          maxLength={60}
        />
        <p className="text-xs text-base-content/60 mt-1 truncate">{user.email}</p>
      </td>
      <td>
        <select value={level} onChange={(e) => setLevel(e.target.value)} className="select select-sm bg-base-300">
          <option value="">No level</option>
          <option value="SMP">SMP</option>
          <option value="SMA">SMA</option>
        </select>
      </td>
      <td className="text-center">{user.solvedCount}</td>
      <td>
        <div className="flex flex-wrap gap-1">
          {isAdmin && <span className="badge badge-primary">Admin</span>}
          {user.hidden ? <span className="badge badge-ghost">Hidden</span> : <span className="badge badge-success badge-outline">Active</span>}
        </div>
      </td>
      <td>
        <div className="flex gap-1 justify-end">
          <Link to={`/admin/users/${user._id}`} className="btn btn-sm btn-ghost gap-1" title="View code and solved problems">
            <CodeIcon className="size-4" />
            View
          </Link>
          <button onClick={save} disabled={!changed || !name.trim() || busy} className="btn btn-sm btn-primary gap-1">
            <SaveIcon className="size-4" />
            Save
          </button>
          {!isSelf && (
            <button onClick={toggleHidden} disabled={busy} className="btn btn-sm btn-ghost gap-1" title={user.hidden ? "Unhide" : "Hide"}>
              {user.hidden ? <EyeIcon className="size-4" /> : <EyeOffIcon className="size-4" />}
              {user.hidden ? "Unhide" : "Hide"}
            </button>
          )}
          {!isAdmin && (
            <button onClick={remove} disabled={busy} className="btn btn-sm btn-error btn-outline gap-1">
              <Trash2Icon className="size-4" />
              Delete
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}

function UsersPage() {
  const { data: users, isLoading, isError } = useAdminUsers();
  const { data: meData } = useGetUser();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (users || []).filter((u) => {
      if (q && !u.name.toLowerCase().includes(q) && !(u.email || "").toLowerCase().includes(q)) return false;
      if (filter === "hidden") return u.hidden;
      if (filter === "none") return !u.level;
      if (filter === "SMP" || filter === "SMA") return u.level === filter;
      return true;
    });
  }, [users, search, filter]);

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Manage Users</h1>
          <p className="text-base-content/70 text-sm md:text-base">
            Edit names and levels, hide inactive accounts from the leaderboard, or delete accounts that are no longer used.
          </p>
        </div>

        <div className="card bg-base-100 p-4 md:p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
            <label className="input input-sm bg-base-300 flex items-center gap-2 w-full md:w-80">
              <SearchIcon className="size-4 opacity-60" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search name or email" className="grow" />
            </label>
            <div className="flex flex-wrap gap-1">
              {FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setFilter(f.value)}
                  className={`btn btn-sm ${filter === f.value ? "btn-primary" : "btn-ghost"}`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {isLoading ? (
            <p className="py-8 text-center text-base-content/70">Loading users...</p>
          ) : isError ? (
            <p className="py-8 text-center text-error">Failed to load users.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Level</th>
                    <th className="text-center">Solved</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-8 text-base-content/60">No users found</td>
                    </tr>
                  ) : (
                    filtered.map((u) => (
                      // key includes the saved values so the row's inputs reset after a save
                      <UserRow key={`${u._id}-${u.name}-${u.level || ""}`} user={u} isSelf={u._id === meData?.user?._id} />
                    ))
                  )}
                </tbody>
              </table>
              <p className="text-xs text-base-content/60 mt-3">
                {filtered.length} of {users?.length || 0} users. Hidden users can still sign in but don't appear on the leaderboard.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsersPage;
