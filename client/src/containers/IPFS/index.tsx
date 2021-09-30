import { create as ipfsCreate } from "ipfs-http-client";
import { useEffect, useState } from "react";

const Ipfs = () => {
    const [text, setText] = useState("");
    const [url, setUrl] = useState(
        "https://ipfs.io/ipfs/QmTn16U9YtbMeGkYWtRFZ5XrNA7tiKQYyRSgX4Es3TWouB"
    );
    const [data, setData] = useState("");

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

    const getIPFSData = async () => {
        try {
            const rawData = await fetch(url);
            const _data = await rawData.text();
            console.log(_data);
            setData(_data);
        } catch (err) {
            console.log("==== err", err);
        }
    };

    useEffect(() => {
        if (url) {
            getIPFSData();
        }
    }, [url]);

    return (
        <div>
            <div>Your text {text}</div>
            <div>
                <a href={url}>url : {url}</a>
            </div>
            <input
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setText(e.target.value)
                }
            />
            <button onClick={submit}>submit</button>
            <div>From IPFS : {data}</div>
        </div>
    );
};

export default Ipfs;
