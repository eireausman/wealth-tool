import millify from "millify";

const getDisplayNumber = (number: number) => {
  const millified = millify(number, {
    precision: 2,
    lowercase: true,
  });
  return millified;
};

export default getDisplayNumber;
