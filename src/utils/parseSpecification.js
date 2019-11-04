const parseSpecification = (specificationText) => {
  let specification;
  if (specificationText) {
    const obj = JSON.parse(specificationText);
    const oKeys = Object.keys(obj);
    if (oKeys.length) {
      specification = `${oKeys[0]}：${obj[oKeys[0]]}`;
    } else {
      specification = '';
    }
  } else {
    specification = '';
  }
  return specification;
};

export default parseSpecification;
