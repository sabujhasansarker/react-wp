import { Fragment, useEffect, useState } from "react";

function App() {
  const [wpData, setWpData] = useState(null);

  useEffect(() => {
    // Access WordPress data
    if (window.wpReactData) {
      setWpData(window.wpReactData);
      console.table("WordPress Data:", window.wpReactData);
    }
  }, []);

  return (
    <Fragment>
      <h1 className="text-[30px]">{wpData && wpData.customData.message}</h1>
    </Fragment>
  );
}

export default App;
