const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
    const gameContract = await gameContractFactory.deploy(
      ["Lakshay","Vidhi","Shivang"], // Names
      [
        "https://www.kindpng.com/picc/m/139-1391017_transparent-boys-png-boy-pic-stylish-png-png.png", //Images for the respective chracters
        "https://img.lovepik.com/element/40172/3117.png_860.png",
        "https://png.pngtree.com/png-clipart/20211116/original/pngtree-anime-characters-cool-boy-png-image_6929016.png"
      ],
      [1000,1250,1100], // Hp for the respective chracters
      [250,350,300] // Attack damage for the respective chracters
    );
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);
    let txn;
    // We only have three characters.
    // an NFT w/ the character at index 2 of our array.
    txn = await gameContract.mintChracterNFT(2);
    await txn.wait();
    console.log("Minted NFT #1");

    txn = await gameContract.mintCharacterNFT(1);
    await txn.wait();
    console.log("Minted NFT #2");

    txn = await gameContract.mintCharacterNFT(2);
    await txn.wait();
    console.log("Minted NFT #3");

    txn = await gameContract.mintCharacterNFT(1);
    await txn.wait();
    console.log("Minted NFT #4");

// Get the value of the NFT's URI.
    console.log("Done deploying and Minting");

  };
  
  const runMain = async () => {
    try {
      await main();
      process.exit(0);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  };
  
  runMain();