import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useSession, isMetaMaskEnabled } from "../components/session";
import styles from "../styles/Home.module.css";

export async function getStaticProps() {
  return {
    props: {
      protected: false,
    },
  };
}

function SignInBack() {
  const router = useRouter();
  const session = useSession();
  const [signInError, setSignInError] = useState<Error | null>(null);

  function onSubmit() {
    function onSuccess() {
      router.push("/");
    }

    function onFailure(error: Error) {
      setSignInError(error);
    }

    session.authenticate().then(onSuccess, onFailure);
  }

  return (
    <div>
      <Head>
        <title>PrivyFlush</title>
      </Head>

      <main className="w-full">
        <div className="min-h-screen w-full bg-gradient-to-br from-blue-200 to-blue-500">
          <section className="mx-auto max-w-7xl">
            <nav className="flex h-24 w-full items-center">
              <div className="mx-auto flex h-24 w-full items-center justify-between font-medium">
                <span className="w-1/2 py-4 px-6 text-xl font-black leading-none sm:w-1/4">
                  PrivyFlush 🌸
                </span>
                {/* TODO(dave): Remove middle nav */}
                <div className="mt-12 flex h-full flex-col items-center justify-center text-center font-medium text-indigo-200 md:mt-0 md:flex-row md:items-center">
                  <a href="#" className="mx-2 py-2 lg:mx-3">
                    Home
                  </a>
                  <a href="#" className="mx-2 py-2 hover:lg:mx-3">
                    Features
                  </a>
                  <a href="#" className="mx-2 py-2 hover:lg:mx-3">
                    Blog
                  </a>
                </div>
                <Link href="https://github.com/privy-io/privy-flush" passHref>
                  <span className="w-1/2 cursor-pointer py-4 px-6 text-right leading-none sm:w-1/4">
                    View Code →
                  </span>
                </Link>
              </div>
            </nav>
          </section>
          {/* TODO(dave): I want this to fill the rest of the parent as a flexbox container for everything below navbar, but parent is not fixed */}
          <div className="h-full w-full flex-col justify-center">
            <section className="m-4">
              <div className="rounded bg-privy-purple opacity-30">
                <div className="text-center text-white opacity-100">
                  <h1>Share files with PrivyFlush.</h1>
                  <div>
                    PrivyFlush allows you to share files with your friends.
                    Everything is encrypted end-to-end by default when using
                    Privy so storing data securely is as simple as a single API
                    call.
                  </div>
                  <div>
                    To view files that have been sent to you, sign in below!
                  </div>
                </div>
                <div className="sign-in-container">
                  {!isMetaMaskEnabled() && (
                    <div className="mm-disabled notification is-danger">
                      Your browser is not MetaMask enabled. To sign in, you must
                      connect with MetaMask using the browser extension
                      available in Chrome and Firefox. You can visit{" "}
                      <a href="https://metamask.io">https://metamask.io</a> to
                      install the extension.
                    </div>
                  )}
                  {signInError !== null && (
                    <div className="mm-disabled notification is-danger">
                      {String(signInError)}
                      <br />
                      <br />
                      Please try signing in again.
                    </div>
                  )}
                  <div>
                    <button
                      className="button is-primary is-medium"
                      onClick={(e) => {
                        e.preventDefault();
                        onSubmit();
                      }}
                    >
                      Sign in
                    </button>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SignInBack;
