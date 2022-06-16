import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { useSession, isMetaMaskEnabled } from "../components/session";

export async function getStaticProps() {
  return {
    props: {
      protected: false,
    },
  };
}

function SignIn() {
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

      <main className="flex h-full w-full flex-col">
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
              <div className="rounded bg-slate-500 opacity-30">
                <h1>Encrypted file sharing for the web.</h1>
                <div>
                  PrivyFlush allows you to share encrypted files with your
                  friends. Sign in with Ethereum to see what's been sent to you
                  and send files to your friends!
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

export default SignIn;
