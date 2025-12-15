import { lazy, Suspense } from 'react';
import type { RouteObject } from 'react-router-dom';
import { Loading } from '@/components/common';

// Lazy load components
const Layout = lazy(() => import('@/layouts/Layout'));
const PageNotFoundView = lazy(() => import('@/components/common/PageNotFoundView'));

// Home page component
const HomePage = lazy(() => import('@/pages/home'));

const TailwindDemo = lazy(() => import('@/pages/TailwindDemo'));

const Market = lazy(() => import('@/pages/market'));
const CourseDetail = lazy(() => import('@/pages/course/[id]'));

const Aave = lazy(() => import('@/pages/aave'));

const Profile = lazy(() => import('@/pages/profile'));

// Demo pages
const WdyrDemo = lazy(() => import('@/pages/demo/wdyrDemo'));
const JotaiDemo = lazy(() => import('@/pages/demo/jotaiDemo'));
const ContractExample = lazy(() => import('@/pages/demo/contractExample'));
const CreateCourse = lazy(() => import('@/pages/createCourse'));
const Exchange = lazy(() => import('@/pages/exchange'));

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
        path: 'market',
        element: (
          <Suspense fallback={<Loading />}>
            <Market />
          </Suspense>
        ),
      },
      {
        path: 'course/:id',
        element: (
          <Suspense fallback={<Loading />}>
            <CourseDetail />
          </Suspense>
        ),
      },
      {
        path: 'create-course',
        element: (
          <Suspense fallback={<Loading />}>
            <CreateCourse />
          </Suspense>
        ),
      },
      {
        path: 'exchange',
        element: (
          <Suspense fallback={<Loading />}>
            <Exchange />
          </Suspense>
        ),
      },
      {
        path: 'aave',
        element: (
          <Suspense fallback={<Loading />}>
            <Aave />
          </Suspense>
        ),
      },
      {
        path: 'profile',
        element: (
          <Suspense fallback={<Loading />}>
            <Profile />
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
