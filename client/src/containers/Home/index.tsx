import { useWeb3React } from "@web3-react/core";
import React, { ReactElement, useEffect, useState } from "react";
import useMsg from "../../hooks/CustomMessageHook";
import getContract from "../../utils/Web3AdoptionContract";

interface IPet {
    petId: number;
    state: "adopted" | "free";
    adoptBy?: string;
}

const Home = () => {
    // ==================================
    // STATE
    // ==================================

    const [pets, setPets] = useState([] as IPet[]);
    const [contract, setContract] = useState<any>();
    const { account, active } = useWeb3React();
    const { setMsg } = useMsg();

    // ==================================
    // INIT
    // ==================================
    // ==================================
    // LISTENER
    // ==================================
    useEffect(() => {
        if (active) {
            deployContract();
        }
    }, [active]);

    useEffect(() => {
        if (contract) {
            getAdopters();
        }
    }, [contract]);

    // ==================================
    // FUNCTIONS
    // ==================================
    const getAdopters = async () => {
        try {
            const adopters = await contract.methods.getAdopters().call();
            const tempPets = adopters.map((adopter: string, index: number) => {
                if (adopter !== "0x0000000000000000000000000000000000000000") {
                    return {
                        petId: index,
                        state: "adopted",
                        adoptBy: adopter,
                    };
                }
                return { petId: index, state: "free" };
            });
            setPets(tempPets);
        } catch (err: any) {
            setMsg({
                show: true,
                type: "error",
                msg: err.message,
            });
        }
    };

    const deployContract = async () => {
        try {
            const tempContract = await getContract();
            setContract(tempContract as any);
        } catch (err: any) {
            setMsg({
                show: true,
                type: "error",
                msg: err.message,
            });
        }
    };

    const adopt = (petIndex: number) => {
        contract.methods
            .adopt(petIndex)
            .send({ from: account })
            .once("receipt", (receipt: any) => {
                console.log("==== petIndex", petIndex);
                setPets(
                    pets.map((pet) => {
                        if (pet.petId === petIndex) {
                            return {
                                ...pet,
                                state: "adopted",
                                adoptBy: account,
                            } as IPet;
                        }
                        return pet;
                    })
                );
            });
    };

    // ==================================
    // RENDER
    // ==================================
    const renderAdopters = () => {
        if (active && pets.length > 0) {
            return pets.map((pet) => {
                return <Adopters pet={pet} key={pet.petId} adopt={adopt} />;
            });
        }
    };

    return <div>{renderAdopters()}</div>;
};

const Adopters = ({
    pet,
    adopt,
}: {
    pet: IPet;
    adopt: (key: number) => void;
}): ReactElement => {
    return (
        <div style={{ border: "1px solid" }}>
            <div>pet id: {pet.petId}</div>
            <div>state: {pet.state}</div>
            {pet.adoptBy ? <div>Adopt by : {pet.adoptBy}</div> : null}
            <button
                onClick={() => {
                    adopt(pet.petId);
                }}
                disabled={pet.state !== "free"}
            >
                Adopt
            </button>
        </div>
    );
};

export default Home;
