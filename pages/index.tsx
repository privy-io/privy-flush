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
        console.log("Fetched inbox");
        console.log("Determining type: ", inbox!.blob().type);
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
      await session.privy.putFile(destinationAddress, "inbox", file);
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
