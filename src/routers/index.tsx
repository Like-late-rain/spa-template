import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Loading } from '@/components/common';

// Lazy load components
const Layout = lazy(() => import('@/layouts/Layout'));
const PageNotFoundView = lazy(() => import('@/components/common/PageNotFoundView'));

// Home page component
const HomePage = lazy(() => import('@/pages/home'));

// About page component
const AboutPage = lazy(() => import('@/pages/aboutPage'));

const TailwindDemo = lazy(() => import('@/pages/TailwindDemo'));

// Demo pages
const WdyrDemo = lazy(() => import('@/pages/demo/wdyrDemo'));
const JotaiDemo = lazy(() => import('@/pages/demo/jotaiDemo'));
const ContractExample = lazy(() => import('@/pages/demo/ContractExample'));

// Route configuration
export const routes: RouteObject[] = [
  {
    path: '/',
    element: (
      <Suspense fallback={<Loading />}>
        <Layout />
      </Suspense>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <HomePage />
          </Suspense>
        ),
      },
      {
        path: 'about',
        element: (
          <Suspense fallback={<Loading />}>
            <AboutPage />
          </Suspense>
        ),
      },
      {
        path: 'theme-display',
        element: (
          <Suspense fallback={<Loading />}>
            <TailwindDemo />
          </Suspense>
        ),
      },
      {
        path: 'demo/wdyr',
        element: (
          <Suspense fallback={<Loading />}>
            <WdyrDemo />
          </Suspense>
        ),
      },
      {
        path: 'demo/jotai',
        element: (
          <Suspense fallback={<Loading />}>
            <JotaiDemo />
          </Suspense>
        ),
      },
      {
        path: 'demo/contract',
        element: (
          <Suspense fallback={<Loading />}>
            <ContractExample />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <PageNotFoundView />,
  },
];

export default routes;
