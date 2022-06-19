import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import { useSession, isMetaMaskEnabled } from "../components/Session";
import { useRouter } from "next/router";
import FlushLogo from "../components/FlushLogo";
import FileIcon from "../components/FileIcon";
import SignIcon from "../components/SignIcon";

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
      console.error(error);
      setSignInError(error);
    }

    session.authenticate().then(onSuccess, onFailure);
  }

  return (
    <div>
      <div className={styles.toilet}></div>
      <div className={styles.outer}>
        <div className={styles.inner}>
          <div className={styles.logo}>
            <FlushLogo></FlushLogo>
          </div>
          <div className={styles.filebox}>
            <button className={styles["uploadbutton-disabled"]} disabled>
              <FileIcon></FileIcon>
              Select files to send
            </button>
          </div>
          <div className={styles.inbox}>
            <h1>Share files with PrivyFlush</h1>
            <p className={styles.description}>
              PrivyFlush allows you to share files with your friends. Everything
              is encrypted end-to-end by default when using Privy so storing
              data securely is as simple as a single API call.
            </p>
            <p>To view files that have been sent to you, sign in below!</p>
            <button
              className={styles.signbutton}
              onClick={(e) => {
                e.preventDefault();
                onSubmit();
              }}
            >
              Sign In With Ethereum
              <SignIcon></SignIcon>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
