import { create as ipfsCreate } from "ipfs-http-client";
import { useState } from "react";

const Ipfs = () => {
    const [text, setText] = useState("");
    const [url, setUrl] = useState("");

    const submit = async () => {
        try {
            const client = ipfsCreate({
                host: "ipfs.infura.io",
                port: 5001,
                protocol: "https",
            });
            const { cid } = await client.add(text);
            setUrl(`https://ipfs.io/ipfs/${cid.toV1()}`);
        } catch (err) {
            console.log("==== err", err);
        }
    };

    return (
        <div>
            <div>Your text {text}</div>
            <div>url : {url}</div>
            <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setText(e.target.value)
                }
            />
            <button onClick={submit}>submit</button>
        </div>
    );
};

export default Ipfs;
