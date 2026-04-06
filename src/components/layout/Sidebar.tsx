'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Receipt,
  FileText,
  CreditCard,
  Briefcase,
  ShoppingCart,
  BarChart3,
  ChevronDown,
  LogOut,
  User,
  Users
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/firebase';
import { useUserProfile } from '@/firebase/firestore/use-user-profile';
import { createCheckoutSession } from '@/lib/stripe';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebase';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { APP_NAME } from '@/lib/constants';

const navItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Sales & Payment',
    icon: Receipt,
    children: [
      { title: 'Estimates', href: '/dashboard/estimates', icon: FileText },
      { title: 'Invoices', href: '/dashboard/invoices', icon: Receipt },
      { title: 'Clients', href: '/dashboard/clients', icon: Users },
      { title: 'Payment Setup', href: '/dashboard/payment-setup', icon: CreditCard },
      { title: 'Services', href: '/dashboard/services', icon: Briefcase },
    ],
  },
  {
    title: 'Purchases',
    href: '/dashboard/purchases',
    icon: ShoppingCart,
  },
  {
    title: 'Report',
    href: '/dashboard/reports',
    icon: BarChart3,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  const { profile, isLoading: isProfileLoading } = useUserProfile();
  const [openMenus, setOpenMenus] = useState<string[]>(['Sales & Payment']);
  const [isUpgrading, setIsUpgrading] = useState(false);

  const handleUpgrade = async () => {
    if (!user || !user.email) return;
    setIsUpgrading(true);
    try {
      await createCheckoutSession(user.uid, user.email);
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleSignOut = async () => {
    if (auth) {
      await signOut(auth);
    }
  };

  return (
    <div className="flex flex-col h-screen w-64 bg-white border-r border-gray-200">
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
          {APP_NAME.charAt(0)}
        </div>
        <span className="font-bold text-xl tracking-tight">{APP_NAME}</span>
      </div>

      <div className="px-4 mb-6">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full justify-between px-2 hover:bg-gray-100 h-12">
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <User className="w-4 h-4 text-gray-500" />
                </div>
                <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-sm font-medium truncate w-full">{user?.displayName || 'User'}</span>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || item.children?.some(child => pathname === child.href);
          const isOpen = openMenus.includes(item.title);

          if (item.children) {
            return (
              <div key={item.title} className="space-y-1">
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md transition-colors",
                    isActive ? "text-gray-900" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("w-5 h-5", isActive ? "text-blue-600" : "text-gray-400")} />
                    {item.title}
                  </div>
                  <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
                </button>
                {isOpen && (
                  <div className="pl-11 space-y-1">
                    {item.children.map((child) => (
                      <Link
                        key={child.title}
                        href={child.href}
                        className={cn(
                          "block px-3 py-2 text-sm font-medium rounded-md transition-colors",
                          pathname === child.href
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        )}
                      >
                        {child.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <Link
              key={item.title}
              href={item.href || '#'}
              className={cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                pathname === item.href
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              )}
            >
              <item.icon className={cn("w-5 h-5", pathname === item.href ? "text-blue-600" : "text-gray-400")} />
              {item.title}
            </Link>
          );
        })}
      </nav>

      {user && !profile?.isPremium && !isProfileLoading && (
        <div className="p-4 m-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-100 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 bg-blue-600 rounded-md shadow-sm">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-sm text-blue-900">Upgrade to Pro</span>
          </div>
          <ul className="space-y-2 mb-4">
            {[
              'Remove all watermarks',
              'Unlimited downloads',
              'Priority support',
              'Custom branding',
              'Ad-free experience'
            ].map((benefit, i) => (
              <li key={i} className="flex items-center gap-2 text-[10px] text-blue-700 font-medium">
                <div className="w-1 h-1 bg-blue-400 rounded-full" />
                {benefit}
              </li>
            ))}
          </ul>
          <Button 
            onClick={handleUpgrade} 
            disabled={isUpgrading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white h-9 text-xs font-bold shadow-md transition-all active:scale-[0.98]"
          >
            {isUpgrading ? 'Loading...' : 'Go Pro Now'}
          </Button>
        </div>
      )}

      {profile?.isPremium && (
        <div className="p-4 m-4 bg-green-50 rounded-xl border border-green-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-green-600 rounded-md">
              <CreditCard className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-sm text-green-900">Pro Plan Active</span>
          </div>
        </div>
      )}
    </div>
  );
}
