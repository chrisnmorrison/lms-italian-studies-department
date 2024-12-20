import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Button, Link } from "@mui/material";
import { doc, setDoc, deleteField } from "firebase/firestore";
import { db } from "../firebase";
import useFetchUsers from "../hooks/fetchUsers";

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const [sortField, setSortField] = useState("firstName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchValue, setSearchValue] = useState("");
  const { users, setUsers, loading } = useFetchUsers();

  const handleDelete = (userKey) => async () => {
    const updatedUsers = { ...users };
    delete updatedUsers[userKey];
    setUsers(updatedUsers);

    const userRef = doc(db, "users", currentUser.uid);
    await setDoc(
      userRef,
      {
        users: {
          [userKey]: deleteField(),
        },
      },
      { merge: true }
    );
  };

  const handleSort = (field) => {
    const newSortOrder =
      sortField === field
        ? sortOrder === "asc"
          ? "desc"
          : sortOrder === "desc"
          ? ""
          : "asc"
        : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const renderSortArrow = (field) => {
    if (sortField !== field) return "↑↓";
    return sortOrder === "asc" ? "↑↑" : sortOrder === "desc" ? "↓↓" : "↑↓";
  };

  const sortedUsers = Object.values(users).sort((a, b) => {
    const compareValues = (fieldA, fieldB) => {
      const aVal = String(a[fieldA]).toLowerCase();
      const bVal = String(b[fieldB]).toLowerCase();
      return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    };

    if (sortField === "isAdmin") {
      const aVal = a[sortField] ? 1 : 0;
      const bVal = b[sortField] ? 1 : 0;
      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    }

    return compareValues(sortField, sortField);
  });

  const filteredUsers = sortedUsers.filter((user) =>
    Object.values(user).some((value) =>
      value.toString().toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  return (
    <div className="w-full text-xs sm:text-sm mx-auto flex flex-col flex-1 gap-3 sm:gap-5">
      <div className="flex items-center">
        <h1 className="text-3xl">User List</h1>
      </div>
      {loading ? (
        <div className="flex-1 grid place-items-center">
          <i className="fa-solid fa-spinner animate-spin text-6xl"></i>
        </div>
      ) : (
        <>
          <div className="search-bar mb-5">
            <span>Search for a user: </span>
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search"
            />
          </div>
          <table className="table-dark">
            <thead>
              <tr>
                {["firstName", "lastName", "studentNumber", "isAdmin", "email"].map((field) => (
                  <th key={field}>
                    <button onClick={() => handleSort(field)}>
                      {field.charAt(0).toUpperCase() + field.slice(1)} {renderSortArrow(field)}
                    </button>
                  </th>
                ))}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-4">No users found</td>
                </tr>
              ) : (
                filteredUsers.map((user, i) => (
                  <tr key={i}>
                    <td>{user.firstName || ""}</td>
                    <td>{user.lastName || ""}</td>
                    <td>{user.studentNumber}</td>
                    <td>{user.isAdmin ? "✅" : "❌"}</td>
                    <td>{user.email}</td>
                    <td className="flex">
                      <Link href={`/editUser/${user.id}`}>
                        <Button size="small" sx={{ mr: 0.5, ml: 0.5 }} variant="contained">
                          Edit User
                        </Button>
                      </Link>
                      <Button
                        size="small"
                        sx={{ ml: 0.5 }}
                        color="error"
                        variant="contained"
                        onClick={() => handleDelete(user.id)}
                      >
                        Delete User
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="mt-5">
            <Link href="/AddUser" underline="hover" style={{ fontSize: "200%", marginBottom: ".5rem" }}>
              <Button size="large" variant="outlined">
                Add New User
              </Button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export const GetServerSideProps = () => {};
