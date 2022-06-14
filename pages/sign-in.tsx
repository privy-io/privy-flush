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
        <title>Privy Flush</title>
      </Head>
      <main>
        <div className="sign-in-container">
          {!isMetaMaskEnabled() && (
            <div className="mm-disabled notification is-danger">
              Your browser is not MetaMask enabled. To sign in, you must connect
              with MetaMask using the browser extension available in Chrome and
              Firefox. You can visit{" "}
              <a href="https://metamask.io">https://metamask.io</a> to install
              the extension.
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
          <div style={{ marginTop: "16px" }}>
            <Link href="https://github.com/privy-io/privy-pii-demo">
              View on Github
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export default SignIn;
