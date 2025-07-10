import { Suspense } from 'react';
import FallbackSpinner from '../common/FallbackSpinner';

/**
 * Reusable component for lazy-loaded routes
 * Eliminates repetitive Suspense wrapper code
 */
const LazyRoute = ({ children, fallback = <FallbackSpinner /> }) => {
  return (
    <Suspense fallback={fallback}>
      {children}
    </Suspense>
  );
};

export default LazyRoute;

