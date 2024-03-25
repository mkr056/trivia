import '@/common/style/global.css';

/**
 * A custom App component is used to control/customize the process of Page initialization.
 * @param {JSX.Element} Component - Prop representing the active page,
 * so whenever you navigate between routes,
 * Component will change to the new page.
 * @returns {JSX.Element} The active page.
 */

// As recommended by Next.js, I override the default behaviour in order to add global styles.
export default function App({Component}) {
  return (
    <Component/>
  );
}