// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

// NFT contract to inherit from.
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Libraries/Base64.sol";
// Helper functions OpenZeppelin provides.
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";


contract MyEpicGame is ERC721{
    // Defining a struct for the attributes of the chracter
    struct characterAttributes{
        uint characterIndex;
        string name;
        string imageURL;
        uint hp;
        uint maxHp;
        uint attackDamage;
    }
    struct Boss{
        string name;
        string imageURL;
        uint hp;
        uint maxHp;
        uint attackDamage;
    }
    event CharacterNFTMinted(address sender, uint256 tokenId, uint256 characterIndex);
    event AttackComplete(address sender, uint newBossHp, uint newPlayerHp);

    // The tokenId is the NFTs unique identifier, it's just a number that goes
    // 0, 1, 2, 3, etc.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // Storing all the chracters 
    characterAttributes[] defaultCharacters ;

    Boss public boss ;
    // We create a mapping from the nft's tokenId => that NFTs attributes.
    mapping(uint256 => characterAttributes) public nftHolderAttributes;

    // A mapping from an address => the NFTs tokenId. Gives me an ez way
    // to store the owner of the NFT and reference it later.
    mapping(address => uint256) public nftHolders;

    // This constructor function helps to initialise the initial no. of character in the games.  
    // when you provide the names, images , Hp and attack damage in the sequential order. 
    constructor (
        string[] memory characterNames,
        string [] memory characterImageURLs,
        uint [] memory characterHp,
        uint [] memory characterAttackDmg,
        string memory bossName,
        string  memory bossImage,
        uint  bossHp,
        uint bossAttack
    )
    ERC721("VidsCoin","VIDS")
    {   
        boss = Boss({
            name : bossName,
            imageURL : bossImage,
            hp : bossHp,
            maxHp : bossHp,
            attackDamage : bossAttack
        });

        console.log("Done initialsing boss with %s Hp %s img %s",boss.name,boss.hp,boss.imageURL);
       for (uint i=0 ; i <characterNames.length; i+=1){
           // This push functions pushes the character one by one in the default Characters sturct array 
           defaultCharacters.push(characterAttributes({
               characterIndex : i,
               name : characterNames[i],
               imageURL : characterImageURLs[i],
               hp : characterHp[i],
               maxHp : characterHp[i],
               attackDamage : characterAttackDmg[i]
           }));

           // This creates a local variable c just to show us which chrachter was pushed into the array
           characterAttributes memory c = defaultCharacters[i];
           console.log("Done initialising with %s w/ HP %s img %s",c.name,c.hp,c.imageURL);
       }
       _tokenIds.increment();

    }

    function mintChracterNFT(uint _chracterIndex) external {
        uint newItemId = _tokenIds.current();

        _safeMint(msg.sender, newItemId);

        nftHolderAttributes[newItemId] = characterAttributes({
            characterIndex  : _chracterIndex,
            name : defaultCharacters[_chracterIndex].name,
            imageURL : defaultCharacters[_chracterIndex].imageURL,
            hp : defaultCharacters[_chracterIndex].hp,
            maxHp : defaultCharacters[_chracterIndex].maxHp,
            attackDamage : defaultCharacters[_chracterIndex].attackDamage
        });

        console.log("Minted NFT w/ token Id %s and Chracter Index %s",newItemId,_chracterIndex);
        nftHolders[msg.sender] = newItemId;
        _tokenIds.increment();
        emit CharacterNFTMinted(msg.sender, newItemId, _chracterIndex);
    }
    function tokenURI(uint256 _tokenId) public view override returns (string memory) {
        characterAttributes memory charAttributes = nftHolderAttributes[_tokenId];

        string memory strHp = Strings.toString(charAttributes.hp);
        string memory strMaxHp = Strings.toString(charAttributes.maxHp);
        string memory strAttackDamage = Strings.toString(charAttributes.attackDamage);

        string memory json = Base64.encode(
            abi.encodePacked(
            '{"name": "',
            charAttributes.name,
            ' -- NFT #: ',
            Strings.toString(_tokenId),
            '", "description": "This is an NFT that lets people play in the game Metaverse Slayer!", "image": "',
            charAttributes.imageURL,
            '", "attributes": [ { "trait_type": "Health Points", "value": ',strHp,', "max_value":',strMaxHp,'}, { "trait_type": "Attack Damage", "value": ',
            strAttackDamage,'} ]}'
            )
        );

        string memory output = string(
            abi.encodePacked("data:application/json;base64,", json)
        );
        
        return output;
        }
     function attackBoss() public {
         //get the state of the player's NFT 
         uint nftTokenOfPlayer = nftHolders[msg.sender];
         characterAttributes storage player = nftHolderAttributes[nftTokenOfPlayer];
         console.log("\n Player chrachter %s about to attack has %s Hp and %s AD",player.name,player.hp,player.attackDamage);
         console.log("Boss %s has %s Hp and %s AD", boss.name,boss.hp,boss.attackDamage);
         // Make sure the player has positive HP 
         require (
             player.hp > 0,
             "Error: Player must have Hp to attack boss"
         );
         
         // Make sure the boss has positive HP 
         require (
             boss.hp > 0,
            "Error: Boss should have HP to attack Player"
         );

         // Allow the player to attack boss
         if (boss.hp < player.attackDamage){
             boss.hp = 0;
         }else {
             boss.hp = boss.hp - player.attackDamage;
         }
         console.log("Player attacked Boss, New boss HP : %s",boss.hp);
         // Allow the boss to attack player
         if (player.hp < boss.attackDamage){
         player.hp = 0;
        }else {
         player.hp = player.hp - boss.attackDamage;
        }
        console.log("Boss Attacked Player, New Player HP : %s ", player.hp);
        emit AttackComplete(msg.sender, boss.hp, player.hp);

        
     }

     function checkIfUserHasNFT() public view returns (characterAttributes memory) {
        // Get the tokenId of the user's character NFT
        uint256 userNftTokenId = nftHolders[msg.sender];
        // If the user has a tokenId in the map, return their character.
        if (userNftTokenId > 0) {
            return nftHolderAttributes[userNftTokenId];
        }
        // Else, return an empty character.
        else {
            characterAttributes memory emptyStruct;
            return emptyStruct;
        }
            }
    function getAllDefaultCharacters() public view returns (characterAttributes[] memory) {
        return defaultCharacters;
    }
    function getBigBoss() public view returns (Boss memory) {
        return boss;
    }   
}