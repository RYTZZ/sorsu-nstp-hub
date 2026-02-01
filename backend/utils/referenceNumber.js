/**
 * Generate a random 10-digit reference number
 */
function generateReferenceNumber() {
  let refNumber = '';
  for (let i = 0; i < 10; i++) {
    refNumber += Math.floor(Math.random() * 10);
  }
  return refNumber;
}

/**
 * Check if a reference number is unique
 */
async function generateUniqueReferenceNumber(Model) {
  let referenceNumber;
  let isUnique = false;

  while (!isUnique) {
    referenceNumber = generateReferenceNumber();
    const existing = await Model.findOne({ where: { referenceNumber } });
    if (!existing) {
      isUnique = true;
    }
  }

  return referenceNumber;
}

module.exports = {
  generateReferenceNumber,
  generateUniqueReferenceNumber
};
