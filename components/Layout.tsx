import React, { FC } from "react";
import Head from "next/head";
import FlushLogo from "./FlushLogo";
import styles from "../styles/Layout.module.css";

interface Props {
  backgroundClass?: string;
  children: React.ReactNode;
}

const Layout: FC<Props> = ({ children, backgroundClass }) => {
  return (
    <>
      <Head>
        <title> PrivyFlush </title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚽</text></svg>"
        />
      </Head>
      <main>
        {backgroundClass ? (
          <div className={backgroundClass}></div>
        ) : (
          <div className={styles.toilet}></div>
        )}

        <div className={styles.outer}>
          <div className={styles.inner}>
            <div className={styles.logo}>
              <FlushLogo></FlushLogo>
            </div>
            {children}
          </div>
        </div>
      </main>
    </>
  );
};

export default Layout;
