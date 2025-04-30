import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/components/ui/use-toast';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { RocketIcon } from '@radix-ui/react-icons';

export function Header() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out successfully",
    });
    setIsMenuOpen(false); // Close menu on logout
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background transition-all duration-300 ease-in-out">
      <div className="container flex h-16 items-center justify-between py-4">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://github.com/Aryan0116/DECODE-CO-A/blob/main/favicon.png?raw=true"
              alt="Decode CO-A Logo"
              className="h-8 w-8 rounded-sm"
            />
            <span className="text-lg font-bold text-primary tracking-tight sm:text-xl">
              Decode CO-A Forum
            </span>
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle Menu"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="transition-transform duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={isMenuOpen
                  ? "M6 18L18 6M6 6l12 12"
                  : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"}
              />
            </svg>
          </Button>

          {isMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-background border-b p-4 flex flex-col gap-2 z-50">
              <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium hover:text-primary py-2 transition-colors duration-200">
                Home
              </Link>
              <Link to="/forum" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium hover:text-primary py-2 transition-colors duration-200">
                Forum
              </Link>
              <ThemeToggle className="py-2" />
              {user ? (
                <>
                  <DropdownMenuSeparator />
                  <div className="flex flex-col space-y-1 py-2">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium hover:text-primary py-2 transition-colors duration-200">
                    Profile
                  </Link>
                  <Link to="/forum/my-posts" onClick={() => setIsMenuOpen(false)} className="text-sm font-medium hover:text-primary py-2 transition-colors duration-200">
                    My Posts
                  </Link>
                  <DropdownMenuSeparator />
                  <Button onClick={handleSignOut} variant="destructive" className="w-full">
                    Log out
                  </Button>
                </>
              ) : (
                <div className="flex flex-col gap-2 py-2">
                  <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="outline" className="w-full transition-colors duration-200">Log in</Button>
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full transition-colors duration-200">Sign up</Button>
                  </Link>
                </div>
              )}
              <DropdownMenuSeparator />
              <Link
                to="https://aryan0116.github.io/DECODE-CO-A/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="py-2 transition-colors duration-200 text-sm font-medium hover:text-primary flex items-center gap-2"
              >
                <RocketIcon className="h-4 w-4 animate-pulse" />
                <span>DECODE CO-A</span>
              </Link>
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden md:flex items-center gap-6">
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors duration-200">
              Home
            </Link>
            <Link to="/forum" className="text-sm font-medium hover:text-primary transition-colors duration-200">
              Forum
            </Link>
          </nav>
          <ThemeToggle />
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar_url || ''} alt={user.username} />
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {user.username.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2">
                  <p className="text-sm font-medium">{user.username}</p>
                  <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/forum/my-posts">My Posts</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login">
                <Button variant="outline" className="transition-colors duration-200">Log in</Button>
              </Link>
              <Link to="/register">
                <Button className="transition-colors duration-200">Sign up</Button>
              </Link>
            </div>
          )}
          <Link
            to="https://aryan0116.github.io/DECODE-CO-A/"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-4"
          >
            <Button className="gap-2 transition-transform duration-300 hover:scale-105">
              <RocketIcon className="h-4 w-4 animate-pulse" />
              <span>DECODE CO-A</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;
