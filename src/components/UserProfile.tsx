
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Settings, BarChart } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function UserProfile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  if (!user) return null;
  
  const userInitials = user.email 
    ? user.email.substring(0, 2).toUpperCase() 
    : 'U';
  
  const userImage = user.user_metadata?.avatar_url;
  const userName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';
  
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="rounded-full h-9 w-9 p-0 relative group">
          <Avatar className="h-9 w-9 transition-all">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-background"></span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64" align="end">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userName}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => navigate('/dashboard')}>
            <BarChart className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
