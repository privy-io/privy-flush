import React, { useEffect, useState } from "react";
import { FieldInstance } from "@privy-io/privy-browser";
import { useSession } from "../components/Session";
import styles from "../styles/Home.module.css";
import FileIcon from "../components/FileIcon";
import Layout from "../components/layout";

function HomePage() {
  const session = useSession();
  const [inbox, setInbox] = useState<FieldInstance | null>(null);
  const [inboxUrl, setInboxUrl] = useState<string>("");
  const [uploadedFile, setUpload] = useState<File | null>(null);
  const [flush, setFlush] = useState<boolean>(false);

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

  // Play flushing sound on send.
  useEffect(() => {
    const flushSound = new Audio("/cropped_flush.mp3");
    if (flush) {
      flushSound.play();
    }
  }, [flush]);

  async function onSend(destinationAddress: string, file: File) {
    try {
      setFlush(true);
      setTimeout(() => {
        setFlush(false);
      }, 4000);
      await session.privy.putFile(destinationAddress, "inbox", file);
    } catch (e) {
      console.log(e);
    }
  }

  const getExtension = (blobType: string) => {
    const parts = blobType.split("/");
    const extension = parts.length > 0 ? parts[1] : "";
    return extension;
  };

  return (
    <Layout backgroundClass={flush ? styles.toiletflush : styles.toilet}>
      <div className={styles.formBox}>
        {uploadedFile ? (
          <SendForm uploadedFile={uploadedFile} onSend={onSend} />
        ) : (
          <UploadForm address={session.address} setUploadedFile={setUpload} />
        )}
      </div>
      <div className={styles.inbox}>
        <div className={styles.flexRow}>
          <h1>Your Inbox </h1>
          <div className={styles.ethAddressWrapper}>
            <p className={styles.ethAddress}>{session.address.slice(0, 7)}</p>
          </div>
        </div>
        {inboxUrl && inbox ? (
          <div className={styles.inboxcontent}>
            <div>inbox.{getExtension(inbox.blob().type)}</div>
            <button
              type="submit"
              onClick={() => window.open(inboxUrl)}
              className={styles.downloadbutton}
            >
              Download
            </button>
          </div>
        ) : null}
      </div>
    </Layout>
  );
}

function UploadForm(props: {
  address: string;
  setUploadedFile: (file: File) => void;
}) {
  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = e.target.files || new FileList();
    const file = fileList[0] || null;
    props.setUploadedFile(file);
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

function SendForm(props: {
  uploadedFile: File;
  onSend: (destination: string, file: File) => void;
}) {
  const [destination, setDestination] = useState<string | null>(null);
  return (
    <div className={styles.sendcontainer}>
      <div className={styles.sendtext}>Your file is ready to share!</div>
      <input
        id="destination"
        type="text"
        autoComplete="off"
        placeholder="Recipient wallet address"
        className={styles.destination}
        onChange={(e) => setDestination(e.target.value)}
      ></input>
      <button
        className={styles.sendbutton}
        onClick={() => {
          props.onSend(destination!, props.uploadedFile);
        }}
      >
        Send
      </button>
    </div>
  );
}

export default HomePage;
