import "@/styles/globals.css";
import { magic } from "@/lib/magic";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Loading from "@/components/loading/loading";

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    async function routeTo() {
      const isLoggedIn = await magic.user.isLoggedIn();
      if (isLoggedIn) {
        router.push("/");
      } else {
        router.push("/login");
      }
    }
    routeTo();
  }, []);

  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  }, [router]);

  return isLoading ? <Loading /> : <Component {...pageProps} />;
}
