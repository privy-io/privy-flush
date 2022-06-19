import React, { useEffect, useState } from "react";
import Head from "next/head";
import { FieldInstance } from "@privy-io/privy-browser";
import { useSession } from "../components/Session";
import styles from "../styles/Home.module.css";
import FlushLogo from "../components/FlushLogo";
import FileIcon from "../components/FileIcon";

function HomePage() {
  const session = useSession();
  const [inbox, setInbox] = useState<FieldInstance | null>(null);
  const [inboxUrl, setInboxUrl] = useState<string | null>(null);
  const [uploadedFile, setUpload] = useState<File | null>(null);

  useEffect(() => {
    async function fetchInboxFromPrivy() {
      try {
        const inbox = await session.privy.getFile(session.address, "inbox");
        setInbox(inbox);
      } catch (error) {
        console.log(error);
      }
    }
    fetchInboxFromPrivy();
  }, [session]);

  // Construct the inbox url when the inbox value changes
  useEffect(() => {
    if (!inbox) {
      return;
    }

    const src = URL.createObjectURL(inbox.blob());
    setInboxUrl(src);

    // Cleanup url after use
    return () => URL.revokeObjectURL(src);
  }, [inbox]);

  async function onSend(destinationAddress: string, file: File) {
    try {
      const inbox = await session.privy.putFile(
        destinationAddress,
        "inbox",
        file
      );
      console.log("Successfully uploaded file");
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <Head>
        <title> PrivyFlush </title>
      </Head>
      <main>
        <div className={styles.toilet}></div>
        <div className={styles.outer}>
          <div className={styles.inner}>
            <div className={styles.logo}>
              <FlushLogo></FlushLogo>
            </div>
            <div className={styles.filebox}>
              <UploadShow
                address={session.address}
                setUploadedFile={setUpload}
              />
              {uploadedFile ? (
                <SendShow uploadedFile={uploadedFile} onSend={onSend} />
              ) : null}
            </div>
            <div className={styles.inbox}>
              <Inbox address={session.address} inboxUrl={inboxUrl} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Inbox(props: { address: string; inboxUrl: string | null }) {
  return (
    <div>
      <h1>Your Inbox </h1>
      {props.inboxUrl ? <a href={props.inboxUrl!}> Download </a> : null}
    </div>
  );
}

function UploadShow(props: {
  address: string;
  setUploadedFile: (file: File) => void;
}) {
  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files || new FileList();
    const file = fileList[0] || null;
    await props.setUploadedFile(file);
  };

  return (
    <button className={styles.uploadbutton}>
      <input type="file" id="file-btn" onChange={onChange} hidden />
      <label htmlFor="file-btn">
        <FileIcon></FileIcon>
        Select files to send
      </label>
    </button>
  );
}

function SendShow(props: {
  uploadedFile: File;
  onSend: (destination: string, file: File) => void;
}) {
  const [destination, setDestination] = useState<string | null>(null);
  return (
    <div>
      <div>
        <input
          id="destination"
          type="text"
          placeholder="destination address"
          onChange={(e) => setDestination(e.target.value)}
        ></input>
      </div>
      <div>
        <button
          onClick={(e) => {
            props.onSend(destination!, props.uploadedFile);
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default HomePage;
