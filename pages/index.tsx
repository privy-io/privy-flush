import React, { useEffect, useState } from "react";
import Head from "next/head";
import { FieldInstance } from "@privy-io/privy-browser";
import { useSession } from "../components/session";

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
        <InboxShow address={session.address} inboxUrl={inboxUrl} />
        <UploadShow address={session.address} setUploadedFile={setUpload} />
        {uploadedFile ? (
          <SendShow uploadedFile={uploadedFile} onSend={onSend} />
        ) : null}
      </main>
    </div>
  );
}

function InboxShow(props: { address: string; inboxUrl: string | null }) {
  return (
    <div>
      <h1>PrivyFlush - Inbox for {props.address}</h1>
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
    <div>
      <div>
        <input type="file" onChange={onChange} />
      </div>
    </div>
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
