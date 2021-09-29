// Version: 0.1
// Author: KMac
// Date: Sept 27, 2021
// Works with https://ipfs.io/ipfs/QmTn16U9YtbMeGkYWtRFZ5XrNA7tiKQYyRSgX4Es3TWouB test data
// Use by calling hydrateLibrary(,,) with the SIPMath Library JSON, Token Name, and number of trials not more than 1000

import { jStat } from 'jstat';

export default function hydrateLibrary(LibraryIn, tokenIn, numberOfTrialsRequested) {
    // console.log("Starting to Hydrate ", tokenIn)
    var output = simulateSIP(LibraryIn, tokenIn) // see siplibs/test.json for token names
    let merged = flatten(output);
    // console.table(merged.slice(0, numberOfTrialsRequested)); // how many trials TODO add option for a specific trial
    return merged.slice(0, numberOfTrialsRequested);
}

const maxTrials = 1000;
function simulateSIP(selfIn, sip) {
    // Expects library as input and the name of A sip
    // TODO: Add an all option for doing all sips
    // example keyword argument for input: simulateSIP("Variable1", HDR2= {"seed3":0, "seed4":1})

    let randomarray = [];
    let returnValue = [];
    // console.log("sip requested ", sip);
    let sipIndex = selfIn.sips.findIndex((item) => item.name === sip);
    // console.log("sipIndex ", sipIndex);

    let aCoeffs = selfIn.sips[sipIndex].arguments.aCoefficients;
    //km console.log("The aCoeffs for ", aCoeffs);
    let lowerBound = "";
    let upperBound = "";
    let a = "";
    // console.log(selfIn.sips[sipIndex].ref);
    let functionName = selfIn.sips[sipIndex].function;
    // This need to be rethought out as we are pulling a lot of numbers we don't need but for now :shrugs:
    if (selfIn.sips[sipIndex].ref.source === "copula") {
        //console.log("matching copula");
        randomarray = generateCopula(selfIn, selfIn.sips[sipIndex].ref.copulaLayer); // c1 or c2 etc
        // console.log("copula generate ", randomarray);
    } else if (selfIn.sips[sipIndex].ref.source === "rng") {
        //km console.log("hmm matching rng sip? that's ok");
        // need "hdr1" and library as input to prepGenerateRandom
        randomarray = prepGenerateRandom(
            selfIn.sips[sipIndex].ref.name,
            selfIn.U01
        );
        //console.log("yo dog ", randomarray);
        // randomarray[0] = temprandomarray;
        //km console.log("NOT copula sip ", randomarray);
    }

    try {
        lowerBound = selfIn.sips[sipIndex]["arguments"]["lowerBound"];
    } catch (e) {
        //km console.log("Nothing to see here. Just no lowerBound");
    }
    try {
        upperBound = selfIn.sips[sipIndex]["arguments"]["upperBound"];
    } catch (e) {
        //km console.log("Nothing to see here. Just no lowerBound");
    }
    // if the function is a built in function Metalog_1_0 then,
    // for each item
    if (functionName === "Metalog_1_0") {
        // TODO: change for loop into a vectorized numpy like function.
        if (randomarray.constructor === Array) { //hmm forgot why I did this. I'm getting old
            let wrapArrayInArray = [randomarray]; // looking for array of arrays
            //km console.log("wrapArrayInArray ", wrapArrayInArray);
            //km console.log("process non copula sip");   
            // console.log("randomarray ", randomarray);
            for (var i = 0; i < randomarray.length; i++) {
                //km console.log("randomarray[i] ", randomarray[i]);
                let ml = metalog(randomarray[i], aCoeffs, lowerBound, upperBound); //console.log("a ", a);
                returnValue.push(ml);
            }

        }
        //km console.log("sipSim length of randomarray ", randomarray.length);
        for (let index = 0; index < randomarray.length; ++index) {
            let ml = metalog(randomarray[index], aCoeffs, lowerBound, upperBound);
            //returnValue.append(ml);
            returnValue.push(ml);
        }
    }
    //selfIn.sips = returnValue;  
    return returnValue;
}

function metalog(y, a, bl = "", bu = "") {
    // y = array of unis, a = aacoeffs
    //km console.log("how many of aCoeffs ", a.length);

    function convert_to_float(a) {
        // Using parseFloat() method
        var floatValue = parseFloat(a);
        // Return float value
        return floatValue;
    }

    //km console.log("y ", typeof y);
    //km console.log("y me ", y); // y[x] is an array of unis may have been thru copula calc
    let vector = [];
    // np_a = np.array(a).reshape(-1, 1)
    //km console.log("a ", typeof a, "a length ", a.length);
    //km console.log("a ", a);
    let np_a = a; 
    //for n in t:
    for (let index = 1; index < (a.length + 1); ++index) { //cant start with 0 coeeffs for each aCoeff
        vector.push(basis(y, index));
    }
    //km console.log("np_a ", typeof np_a, 'length: ', np_a.length);
    //km console.log("vector ", typeof vector, " length ", vector.length);

    let wrappedVector = [vector];
    let wrappedNp_x = [np_a];
  
    let wrappedNp_a = wrappedNp_x[0].map(e => [e])

    let mky = multiply(wrappedVector, wrappedNp_a);
    // console.log("mm array of unis with acoeffs HERE ", mky); // Important check point

    // Unbounded
    if (typeof (bl) == String && typeof (bu) == String) {
        return mky; // working
    }
    if (
        (typeof bl === "string" || bl instanceof String) &&
        (typeof bu === "string" || bu instanceof String)
    ) {
        return mky; // TODO not tested!! may not be needed for hackathon
    }
    // Bounded lower
    else if (typeof bl !== "string" && typeof bu == "string") {
        convert_to_float(bl);
        return bl + Math.exp(mky); // TODO not tested!! may not be needed for hackathon
    }
    // Bounded upper
    else if (typeof bl == "string" && typeof bu != "string") {
        convert_to_float(bu);
        return bu - Math.exp(-mky); // TODO not tested!! may not be needed for hackathon
    }
    // Bounded
    else if (typeof bl != "string" && typeof bu != "string") {
        return bl + (bu * Math.exp(mky)) / (1 + Math.exp(mky)); // TODO not tested!! may not be needed for hackathon
    }
}

function generateCopula(selfy, copulaCount) {
    // console.log(selfy, copulaCount);
    let ret = [];
    let whichCorrelationMatrix = [];
    // Do all of this for all copulas in the layer
    selfy.U01.copula.forEach((copula) => {
        if (copula.function === "GaussianCopula") {
            // now get the cholesky factors
            //  get the global variable
            let specifyCorrelationMatrix = copula.arguments.correlationMatrix.value;
            let copulaArgs = copula.arguments.rng;
            let randomMatrixOfHDRs = [];
            for (let i = 0; i < copulaArgs.length; i++) {
                //km console.log("caller ", copulaArgs[i]);
                let val = prepGenerateRandom(copulaArgs[i], selfy.U01); // from U01/RNG
                /* TODO update HDRv2 using { "counter": "PM_Index","entity": 1,"varId": 6187319,"seed3": 0,"seed4": 0} */
                randomMatrixOfHDRs.push(val);
                //km console.log("randomMatrixOfHDRs ", randomMatrixOfHDRs);
            }

            selfy.globalVariables.forEach((item, index) => {
                if (item["name"] == specifyCorrelationMatrix) {
                    whichCorrelationMatrix = index;
                } else {
                    let index = -1;
                }
            });

            let thisCorrelationMatrix =
                selfy.globalVariables[whichCorrelationMatrix].value.matrix;
            let correlationMatrix = convertMx(thisCorrelationMatrix);

            // Find the Cholesky Factors
            //km console.log("you are lower tri ", correlationMatrix);
            let cho = jStat(jStat.cholesky(correlationMatrix));

            //km console.log("Cholesky: \n", cho); // IMPORTANT CHECKPOINT

            //cho = np.matrix(cho)
            //Apply the Cholesky Factors to the randoms
            let col = copula.copulaLayer.findIndex((item) => item === copulaCount); //
            //km console.log("this is copula level eg 2=c3,3=c4 ", col);
            let choSubSample = cho[col].slice(0, col + 1); //
            ////km console.log("this is cho sample ", choSubSample);
            let runiRow = [];
            let corrSamples = [];
            let normSinv = [];

            for (let i = 0; i < randomMatrixOfHDRs[0].length; i++) {
                // for each trail
                let randomMatrixHRDsSample = [];
                for (let index = 0; index < col + 1; ++index) {
                    //each variable upto pos col
                    // get first x cols in randuniframe
                    randomMatrixHRDsSample[index] = randomMatrixOfHDRs[index]; //
                    ////km console.log(randomMatrixHRDsSample[index].length);
                    // //km console.log("runi samples only arrays needed ", randomMatrixHRDsSample);

                    runiRow[i] = randomMatrixHRDsSample.map(function (x) {
                        ////km console.log("runi row ", index, x[0]);
                        return x[i];
                    });
                    //km console.log("runi row ", runiRow);
                }
                ///console.log("runi row and choSubSample ", runiRow[i], choSubSample); //IMPORTANT
                normSinv = runiRow[i].map((sin) => jStat.normal.inv(sin, 0, 1)); // TODO: Replace jstat 
                //console.log("corrSamples after normInv of rand ", normSinv);
                corrSamples[i] = jStat.dot(normSinv, choSubSample); // TODO: Replace jstat 
                corrSamples[i] = jStat.normal.cdf(corrSamples[i], 0, 1); // TODO: Replace jstat 
            }
            //console.log("YIPPE check me... ", corrSamples);
            ret = corrSamples;

        } else {
            console.log(
                "TypeError The function type for this copula is unsupported. "
            );
        }
    });
    return ret;
}

function prepGenerateRandom(args, selfIn) {
    // from U01/RNG
    /*  {
                      "counter": "PM_Index",
                      "entity": 1,
                      "varId": 6187319,
                      "seed3": 0,
                      "seed4": 0
                  } */
    //console.log("in bound ",args);
    // console.log("in bound selfIn ", selfIn.rng);
    let rngArgs = selfIn.rng.findIndex((x) => x.name === args);
    // console.log(args, rngArgs);
    //console.log("seed ", selfIn.rng[rngArgs].arguments.varId);
    var samples = [];
    const seedPerDist = selfIn.rng[rngArgs].arguments.varId;
    // console.log(seedPerDist); // just one for now
    for (var distTrials = 0; distTrials < maxTrials; distTrials++) {
        samples[distTrials] = HDRando(seedPerDist, distTrials);
    }
    // console.log("samples og ", samples); // IMPORTANT
    return samples;
}

// hubbardresearch.com for more info. This is a function that generates the random numbers with seeds.
// TODO update this to use all the seeds from the U01/RNG ie use HRDv2. Move into own package?
function HDRando(seed, PM_Index) {
    const largePrime = 2147483647;
    const million = 1000000;
    const tenMillion = 10000000;
    // We need this in js unles we find a modulo function
    function MOD(n, m) {
        var remain = n % m;
        return Math.floor(remain >= 0 ? remain : remain + m);
    }
    let randi =
        (MOD(
                (MOD(
                        (seed + million) ^ (2 + (seed + million) * (PM_Index + tenMillion)),
                        99999989
                    ) +
                    1000007) *
                (MOD(
                        (PM_Index + tenMillion) ^
                        (2 +
                            (PM_Index + tenMillion) *
                            MOD(
                                (seed + million) ^
                                (2 + (seed + million) * (PM_Index + tenMillion)),
                                99999989
                            )),
                        99999989
                    ) +
                    1000013),
                largePrime
            ) +
            0.5) /
        largePrime;
    return randi;
}
// HELPER FUNCTIONS TODO: Remove need for jstat
function convertMx(correlationMatrix) {
    let variables = [];

    //gotta figure out all of the variables in the matrix
    //console.log("coreLMat ", correlationMatrix);
    correlationMatrix.forEach((sipVar) => {
        if (variables.includes(sipVar["row"])) {
            //console.log("variables already in");
        } else {
            variables.push(sipVar["row"]);
            //console.log("here now ", variables);
        }
    });

    let variableCount = variables.length;
    let returnArray = Array(variableCount)
        .fill()
        .map(() => Array(variableCount).fill(0));
    //console.log("returnarr", returnArray);

    correlationMatrix.forEach((items) => {
        //console.log("vars ", variables);
        //console.log("items ", items);

        let i = items.row;
        let j = items.col;

        i = variables.indexOf(items["row"]);
        j = variables.indexOf(items["col"]);
        let value = items.value;
        returnArray[i][j] = value;
        returnArray[j][i] = value;
    });
    /*
    var testMatrix = [
      [1, 0.847718, 0.055669605, 0.485944056, 0.564808183],
      [0, 0.530447163, 0.029540807, 0.247911917, 0.045299211],
      [0, 0, 0.998012142, -0.28349892, -0.080721634],
      [0, 0, 0, 0.788686514, 0.186186642],
      [0, 0, 0, 0, 0.798597678]
    ];
    */
    //console.log("ret array ", returnArray);
    return returnArray;
}

function multiply(a, b) {
    //console.log("a ", a, "b", b);
    var aNumRows = a.length,
        aNumCols = a[0].length || 0, // if a is a vector
        bNumRows = b.length,
        bNumCols = b[0].length || 0,
        m = new Array(aNumRows); // initialize array of rows
    //console.log("aNumRows ", aNumRows, "aNumCols ", aNumCols,"bNumCols",bNumCols,"bNumCols",bNumCols);
    for (var r = 0; r < aNumRows; ++r) {
        m[r] = new Array(bNumCols); // initialize the current row
        for (var c = 0; c < bNumCols; ++c) {
            //console.log("r ", r, "c ", c);
            m[r][c] = 0; // initialize the current cell
            for (var i = 0; i < aNumCols; ++i) {
                m[r][c] += a[r][i] * b[i][c];
                // console.log("a[r][i] ", a[r][i]);
            }
        }
    }
    return m;
}

function basis(y, t) { // y must be uniform 0-1
    // console.log("aCoeff position in basis ", t, y);
    //console.log("y in basis ", y);
    let ret = 0;
    if (t === 1) {
        ret = 1;
    } else if (t === 2) {
        ret = Math.log(y / (1 - y));
        // console.log("ret when t2 ", y, ret);
        if (isNaN(ret)) {
            //       console.log("ret when t2 ", y, ret);
        }
    } else if (t === 3) {
        ret = (y - 0.5) * Math.log(y / (1 - y));
        if (isNaN(ret)) {
            console.log("ret when t3 ", y, ret);
        }
    } else if (t === 4) {
        ret = y - 0.5;
        if (isNaN(ret)) {
            //     console.log("ret when t4 ", y, ret);
        }
    } else if (t >= 5 && t % 2 === 1) {
        ret = Math.pow(y - 0.5, Math.floor((t - 1) / 2));
        if (isNaN(ret)) {
            //     console.log("ret when t5 ", y, ret);
        }
    } // requires js int division
    else if (t >= 6 && t % 2 === 0) {
        ret = Math.pow(y - 0.5, Math.floor((t - 1) / 2)) * Math.log(y / (1 - y));
        if (isNaN(ret)) {
            //     console.log("ret when t6>= ", y, ret);
        }
    } // requires js int division need to check if this is correct
    // console.log("out from basis ", ret);
    return ret;
}

function flatten(arr) {
  return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
  }, []);
}