import Head from "next/head";
import styles from "../styles/Login.module.css";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { magic } from "@/lib/magic";
const Login = () => {
  const [userMsg, setUserMsg] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const handleLoginWithEmail = async (e) => {
    e.preventDefault();

    console.log({ email });
    if (email) {
      //route to dashboard
      try {
        setIsLoading(true);
        const didToken = await magic.auth.loginWithMagicLink({ email });
        console.log({ didToken });
        if (didToken) {
          const response = await fetch("/api/login", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${didToken}`,
              "Content-Type": "application/json",
            },
          });

          const loggedInResponse = await response.json();
          if (loggedInResponse.done) {
            console.log({ loggedInResponse });
            router.push("/");
          } else {
            setIsLoading(false);
            setUserMsg("Something went wrong");
          }
        }
      } catch (error) {
        setIsLoading(false);
        console.error("Something went wrong logging in", error);
      }
    } else {
      setIsLoading(false);
      setUserMsg("Oops, something went wrong loggin in.");
    }
  };

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

  const handleOnChangeEmail = (e) => {
    setUserMsg("");
    //console.log("event", e)
    const email = e.target.value;
    setEmail(email);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Steflix Sign In</title>
      </Head>
      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <a className={styles.logoLink} href="/">
            <div className={styles.logoWrapper}>
              <Image
                src="/static/steflix.png"
                alt="Netflix logo"
                width="128"
                height="49"
              />
            </div>
          </a>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>
          <input
            type="text"
            placeholder="Email address"
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
          />
          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
};
export default Login;
