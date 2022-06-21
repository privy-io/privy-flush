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
      const result = await session.privy.putFile(
        destinationAddress,
        "inbox",
        file
      );

      setFlush(true);
      setTimeout(() => {
        setFlush(false);
      }, 4000);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div>
      <Head>
        <title> PrivyFlush </title>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚽</text></svg>"
        />
      </Head>
      <main>
        <div className={flush ? styles.toiletflush : styles.toilet}></div>
        <div className={styles.outer}>
          <div className={styles.inner}>
            <div className={styles.logo}>
              <FlushLogo></FlushLogo>
            </div>
            <div className={styles.filebox}>
              {uploadedFile ? (
                <SendShow uploadedFile={uploadedFile} onSend={onSend} />
              ) : (
                <UploadShow
                  address={session.address}
                  setUploadedFile={setUpload}
                />
              )}
            </div>
            <div className={styles.inbox}>
              <Inbox inbox={inbox} inboxUrl={inboxUrl} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Inbox(props: {
  inbox: FieldInstance | null;
  inboxUrl: string | null;
}) {
  return (
    <div>
      <h1>Your Inbox </h1>
      {props.inboxUrl && props.inbox ? (
        <InboxContent inbox={props.inbox!} inboxUrl={props.inboxUrl!} />
      ) : null}
    </div>
  );
}

function InboxContent(props: { inbox: FieldInstance; inboxUrl: string }) {
  const getExtension = (blobType: string) => {
    const parts = blobType.split("/");
    const extension = parts.length > 0 ? parts[1] : "";
    return extension;
  };
  return (
    <div className={styles.inboxcontent}>
      <div>
        inbox.{getExtension(props.inbox.blob().type)} |{" "}
        {(props.inbox.blob().size / Math.pow(1024, 2)).toFixed(1)} MB
      </div>
      <button
        type="submit"
        onClick={(e: React.MouseEvent<HTMLButtonElement>) =>
          window.open(props.inboxUrl)
        }
        className={styles.downloadbutton}
      >
        Download
      </button>
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
    <div className={styles.sendcontainer}>
      <div className={styles.sendtext}>Your file is ready to share!</div>
      <input
        id="destination"
        type="text"
        placeholder="<Enter the wallet address of the recipient>"
        className={styles.destination}
        onChange={(e) => setDestination(e.target.value)}
      ></input>
      <button
        className={styles.sendbutton}
        onClick={(e) => {
          props.onSend(destination!, props.uploadedFile);
        }}
      >
        Send
      </button>
    </div>
  );
}

export default HomePage;
