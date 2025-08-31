import { Box, Typography, Avatar } from '@mui/material';
import { Person } from '@mui/icons-material';

interface ProfileHeaderProps {
  username: string;
}

export default function ProfileHeader({ username }: ProfileHeaderProps) {
  return (
    <Box className="flex items-center space-x-4">
      <Avatar className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <Person fontSize="large" />
      </Avatar>
      <Box>
        <Typography variant="h4" className="font-bold text-gray-800">
          Profile
        </Typography>
        <Typography variant="h6" className="text-gray-600">
          @{username}
        </Typography>
      </Box>
    </Box>
  );
}
