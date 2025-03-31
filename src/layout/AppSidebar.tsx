'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSidebar } from '@/context/SidebarContext';
import { Ellipsis, LayoutGrid, Calendar, CircleUserRound, ReceiptText, Sheet, NonBinary } from 'lucide-react';
import { useSession } from 'next-auth/react';

type NavItem = {
  name: string;
  path: string;
  icon: React.ReactElement;
};

const AppSidebar: React.FC = () => {
  const { data: session, status } = useSession();
  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      path: '/home',
      icon: <LayoutGrid size={22} />,
    },
    {
      name: 'Calendar',
      path: '/home/calendar',
      icon: <Calendar size={22} />,
    },
    {
      name: 'User Profile',
      path: '/home/profile',
      icon: <CircleUserRound size={22} />,
    },
    {
      name: 'Forms',
      path: '/home/form-elements',
      icon: <ReceiptText size={22} />,
    },
    {
      name: 'Tables',
      path: '/home/basic-tables',
      icon: <Sheet size={22} />,
    },
  ];

  if (status === 'authenticated' && session) {
    const role = session.user.role;

    if (role === 'student') {
      navItems.push({
        name: 'Dummy student',
        path: '/home/dummy',
        icon: <NonBinary size={22} />,
      });
    } else if (role === 'faculty') {
      navItems.push({
        name: 'Dummy Faculty',
        path: '/home/dummy',
        icon: <NonBinary size={22} />,
      });
    } else if (role === 'admin') {
      navItems.push({
        name: 'Dummy Admin',
        path: '/home/dummy',
        icon: <NonBinary size={22} />,
      });
    }
  }

  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  const renderMenuItems = (navItems: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {navItems.map((nav) => (
        <li key={nav.name}>
          {
            <Link
              href={nav.path}
              className={`menu-item group ${isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'}`}
            >
              <span className={`${isActive(nav.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive'}`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && <span className={`menu-item-text p-1`}>{nav.name}</span>}
            </Link>
          }
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? 'w-[290px]' : isHovered ? 'w-[290px]' : 'w-[90px]'}
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex ${!isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'}`}>
        <Link href="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <>
              <Image className="dark:hidden" src="/images/logo/logo.svg" alt="Logo" width={150} height={40} />
              <Image
                className="hidden dark:block"
                src="/images/logo/CSSI_WHITE.svg"
                alt="Logo"
                width={150}
                height={40}
              />
            </>
          ) : (
            <Image src="/images/logo/logo-icon.svg" alt="Logo" width={32} height={32} />
          )}
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div>
            <h1
              className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
              }`}
            >
              {isExpanded || isHovered || isMobileOpen ? 'Menu' : <Ellipsis />}
            </h1>
            {renderMenuItems(navItems)}
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
