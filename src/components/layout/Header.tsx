'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FileText, Menu, LogIn } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { APP_NAME, DEFAULT_LOGO } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { AuthDialog } from '../auth/AuthDialog';


import Image from 'next/image';

const baseNavLinks = [
  { href: '/', label: 'Invoice' },
  { href: '/estimate', label: 'Estimate' },
  { href: '/blog', label: 'Blog' },
];

export default function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const isAdmin = user?.email === 'indritzaganjori@gmail.com';

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Close mobile menu on logout if it's open
      if (isMobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getNavLinks = () => {
    const userLinks = user ? [{ href: '/dashboard', label: 'Dashboard' }] : [];
    const adminLinks = isAdmin ? [{ href: '/admin', label: 'CMS' }] : [];
    return [...baseNavLinks, ...userLinks, ...adminLinks];
  };

  const currentNavLinks = getNavLinks();

  const renderNavLinks = (isMobile = false) =>
    currentNavLinks.map((link) => (
      <Link href={link.href} key={link.href}>
        <span
          className={cn(
            'transition-colors hover:text-primary',
            pathname === link.href
              ? 'text-primary font-semibold'
              : 'text-muted-foreground',
            isMobile &&
              'block w-full rounded-md p-3 text-base hover:bg-secondary'
          )}
          onClick={() => isMobile && setMobileMenuOpen(false)}
        >
          {link.label}
        </span>
      </Link>
    ));

  return (
    <header
      className={cn(
        'sticky top-0 z-50 w-full border-b border-transparent transition-all',
        isScrolled ? 'border-border bg-background/80 backdrop-blur-sm' : ''
      )}
    >
      <div className="container mx-auto flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src={DEFAULT_LOGO} alt="Logo" width={32} height={32} className="rounded-sm" />
          <span className="font-headline text-lg font-bold text-foreground leading-tight max-w-[180px] sm:max-w-none">
            {APP_NAME}
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {renderNavLinks()}
        </nav>

        <div className="flex items-center gap-2">
          {isUserLoading ? (
            <div className="h-8 w-24 animate-pulse rounded-md bg-muted"></div>
          ) : user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={user.photoURL || undefined}
                      alt={user.displayName || 'User'}
                    />
                    <AvatarFallback>
                      {user.displayName?.charAt(0) ||
                        user.email?.charAt(0) ||
                        'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {user.displayName || 'User'}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">CMS</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthDialog />
          )}

          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs p-0">
                <SheetHeader>
                  <SheetTitle className="sr-only">Mobile Menu</SheetTitle>
                  <SheetDescription className="sr-only">
                    A list of navigation links for the website.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex h-full flex-col p-6">
                  <div className="mb-6 flex items-center">
                    <Link
                      href="/"
                      className="flex items-center gap-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Image src={DEFAULT_LOGO} alt="Logo" width={32} height={32} className="rounded-sm" />
                      <span className="font-headline text-lg font-bold text-foreground leading-tight">
                        {APP_NAME}
                      </span>
                    </Link>
                  </div>

                  <nav className="flex flex-col gap-4">{renderNavLinks(true)}</nav>

                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
