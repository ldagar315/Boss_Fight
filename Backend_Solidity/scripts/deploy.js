const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory('MyEpicGame');
    const gameContract = await gameContractFactory.deploy(
      ["Lakshay","Vidhi","Shivang"], // Names
      [
        "https://i.imgur.com/pKd5Sdk.png", // Images
        "https://i.imgur.com/xVu4vFL.png", 
        "https://i.imgur.com/WMB6g9u.png"
      ],
      [1000,1250,1100], // Hp for the respective chracters
      [250,350,300], // Attack damage for the respective chracters
      // Initialising various parameters for the boss
      "Ra.one", // Name
      "https://i.pinimg.com/originals/d5/68/da/d568da0b152c65604391c9d1f03bc5e1.jpg", // Image
      3000, // HP 
      30    // Attack Damage
    );
    await gameContract.deployed();
    console.log("Contract deployed to:", gameContract.address);
    
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