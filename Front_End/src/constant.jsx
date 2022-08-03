const CONTACT_ADDRESS = '0xc44073F44C761D3194AB1bdBcc13464af39CdBAB';

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURL: characterData.imageURL,
    hp: characterData.hp.toNumber(),
    maxHp: characterData.maxHp.toNumber(),
    attackDamage: characterData.attackDamage.toNumber(),
  };
};

export { CONTACT_ADDRESS, transformCharacterData };
