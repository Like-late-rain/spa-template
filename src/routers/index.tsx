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
    ],
  },
  {
    path: '*',
    element: <PageNotFoundView />,
  },
];

export default routes;
