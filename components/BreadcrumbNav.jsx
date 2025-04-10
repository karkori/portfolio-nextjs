"use client";

import React from 'react';
import Link from 'next/link';
import { useTheme } from '@/providers/ThemeProvider';

const BreadcrumbNav = ({ title }) => {
  const { theme } = useTheme();
  
  // Estilos inline basados en el tema
  const homeLinkStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: theme === 'light' ? '#111827' : '#e5e7eb',
  };
  
  const blogLinkStyle = {
    marginLeft: '0.25rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: theme === 'light' ? '#111827' : '#e5e7eb',
  };
  
  const currentPageStyle = {
    marginLeft: '0.25rem',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: theme === 'light' ? '#374151' : '#d1d5db',
    maxWidth: '250px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  };
  
  const dividerStyle = {
    width: '0.75rem',
    height: '0.75rem',
    margin: '0 0.25rem',
    color: theme === 'light' ? '#4b5563' : '#9ca3af',
  };
  
  const hoverStyle = (e) => {
    e.target.style.color = '#0d9488';
  };
  
  const leaveStyle = (e) => {
    e.target.style.color = theme === 'light' ? '#111827' : '#e5e7eb';
  };
  
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link 
            href="/" 
            style={homeLinkStyle}
            onMouseEnter={hoverStyle}
            onMouseLeave={leaveStyle}
          >
            <svg className="w-3 h-3 mr-2.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
              <path d="m19.707 9.293-2-2-7-7a1 1 0 0 0-1.414 0l-7 7-2 2a1 1 0 0 0 1.414 1.414L2 10.414V18a2 2 0 0 0 2 2h3a1 1 0 0 0 1-1v-4a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 0 1 1h3a2 2 0 0 0 2-2v-7.586l.293.293a1 1 0 0 0 1.414-1.414Z"/>
            </svg>
            Inicio
          </Link>
        </li>
        <li>
          <div className="flex items-center">
            <svg style={dividerStyle} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
            <Link 
              href="/blog" 
              style={blogLinkStyle}
              onMouseEnter={hoverStyle}
              onMouseLeave={leaveStyle}
            >
              Blog
            </Link>
          </div>
        </li>
        <li aria-current="page">
          <div className="flex items-center">
            <svg style={dividerStyle} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
            </svg>
            <span style={currentPageStyle}>{title}</span>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default BreadcrumbNav;
