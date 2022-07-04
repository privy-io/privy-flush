import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import { useSession } from "../components/Session";
import { useRouter } from "next/router";
import FileIcon from "../components/FileIcon";
import SignIcon from "../components/SignIcon";
import Layout from "../components/Layout";

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

  function onSubmit() {
    function onSuccess() {
      router.push("/");
    }

    function onFailure(error: Error) {
      console.error(error);
    }

    session.authenticate().then(onSuccess, onFailure);
  }

  return (
    <Layout>
      <div className={styles.formBox}>
        <button className={styles["uploadbutton-disabled"]} disabled>
          <FileIcon></FileIcon>
          Select files to send
        </button>
      </div>
      <div className={styles.inbox}>
        <h1>Share files with PrivyFlush</h1>
        <p>
          PrivyFlush allows you to share files with your friends via their
          ethereum address.
        </p>
        <p>
          Everything is encrypted end-to-end client side and only the owner of
          the address can view the file.
        </p>
        <p>
          This shows how you can build something similar to
          <a href="https://wormhole.app/"> wormhole.app</a> on top of
          {" Privy's "}
          platform.
        </p>
        <button
          onClick={(e) => {
            e.preventDefault();
            onSubmit();
          }}
        >
          Sign In With Ethereum
          <SignIcon></SignIcon>
        </button>
      </div>
    </Layout>
  );
}

export default SignIn;
