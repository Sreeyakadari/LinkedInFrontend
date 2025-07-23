import NavBarComponent from '@/Components/NavBar';
import React from 'react'

export default function UserLayout({children}) {
  return (
    <div>
     <NavBarComponent/>
      {children}
    </div>
  );
}
