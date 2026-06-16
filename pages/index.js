import Ubuntu from "../components/ubuntu";
import IOS from "../components/ios";
import useDeviceDetect from "../components/hooks/useDeviceDetect";
import ReactGA from 'react-ga4';
import Meta from "../components/SEO/Meta";

const TRACKING_ID = process.env.NEXT_PUBLIC_TRACKING_ID;
if (TRACKING_ID) {
  ReactGA.initialize(TRACKING_ID);
}

function App() {
  const isMobile = useDeviceDetect();

  return (
    <>
      <Meta />
      {isMobile ? <IOS /> : <Ubuntu />}
    </>
  )
}

export default App;
