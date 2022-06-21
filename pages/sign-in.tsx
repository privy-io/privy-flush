import React, { useState } from "react";
import styles from "../styles/Home.module.css";
import { useSession } from "../components/Session";
import { useRouter } from "next/router";
import FileIcon from "../components/FileIcon";
import SignIcon from "../components/SignIcon";
import Layout from "../components/layout";

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
          PrivyFlush allows you to share files with your friends, by sending
          them to an ethereum address. Only the owner of the address can view
          the file.
          <br />
          Everything is encrypted end-to-end client side by default, and Privy
          is storing ciphertext data securely.
        </p>
        <p>To view your inbox, sign in below!</p>
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
    </Layout>
  );
}

export default SignIn;
