const randNumber = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const breakOrder = (obj, custId) => {
  let { cake, cookies, muffins, ...rest } = obj;
  let orderArr = [];
  let branchId = randNumber(1, 1000);

  if (Number(cake) !== 0) {
    orderArr.push({
      cust_id: custId,
      prod_id: 111,
      quantity: Number(cake),
      status: "created",
      branch_id: branchId,
    });
  }

  if (Number(cookies) !== 0) {
    orderArr.push({
      cust_id: custId,
      prod_id: 112,
      quantity: Number(cookies),
      status: "created",
      branch_id: branchId,
    });
  }

  if (Number(muffins) !== 0) {
    orderArr.push({
      cust_id: custId,
      prod_id: 113,
      quantity: Number(muffins),
      status: "created",
      branch_id: branchId,
    });
  }
  return orderArr;
};

module.exports = breakOrder;
