import { Toaster } from "sonner";
import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <>
      <Toaster richColors visibleToasts={10} />
      <Component {...pageProps} />
    </>
  );
};

export default api.withTRPC(MyApp);
