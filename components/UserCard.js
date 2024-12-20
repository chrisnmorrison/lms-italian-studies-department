import React from "react";
import { Button } from "@mui/material";
import Link from "next/link";

export default function UserCard(props) {
  const { children, edit, edittedValue, setEdittedValue, userKey } = props;

  return (
    <div className="p-2 relative sm:p-3 border flex items-center border-white border-solid ">
      <div className="flex-1 flex flex-col">
        {!(edit === userKey) ? (
          <>{children}</>
        ) : (
          <input
            className="bg-inherit flex-1 text-white outline-none"
            value={edittedValue}
            onChange={(e) => setEdittedValue(e.target.value)}
          />
        )}
        {/* {children} */}
      </div>
      <Link href={`editUser/${userKey.id}`}>
        <Button variant="contained">Edit User</Button>
      </Link>
    </div>
  );
}
