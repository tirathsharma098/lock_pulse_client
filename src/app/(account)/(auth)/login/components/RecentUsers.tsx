"use client";

import { useEffect, useState } from "react";
import { getSavedUsers } from "@/lib/usersFn";
import { Paper, Typography, Chip, Box } from "@mui/material";
import { PersonOutline } from "@mui/icons-material";

export default function RecentUsers({ onSelectUser }: { onSelectUser?: (username: string) => void }) {
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    setUsers(getSavedUsers());
  }, []);

  if (users.length === 0) return null;

  return (
    <Paper elevation={2} className="!p-4 shadow-lg border border-white/20 backdrop-blur-sm bg-white/90">
      <Typography variant="body2" className="!mb-3 text-center text-gray-600 font-medium">
        Recent accounts
      </Typography>
      <Box className="flex flex-wrap justify-center gap-2">
        {users.map((username) => (
          <Chip
            key={username}
            icon={<PersonOutline className="!text-blue-600" />}
            label={username}
            onClick={() => onSelectUser?.(username)}
            className="!bg-gradient-to-r !from-blue-50 !to-indigo-50 hover:!from-blue-100 hover:!to-indigo-100 !transition-all !duration-200 hover:!scale-105 !cursor-pointer !shadow-sm"
            clickable
          />
        ))}
      </Box>
    </Paper>
  );
}
