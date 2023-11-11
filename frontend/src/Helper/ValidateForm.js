function validateForm(fname, lname, orderObj) {
  // check length
  if (fname.length < 2 || lname.length < 2) {
    return [false, "First and last name should atleast be 2 characters long."];
  } else if (orderObj.c_phno.length !== 10) {
    return [false, "Phone no. should be a 10 characters long"];
  } else if (
    orderObj.cake.length === 0 &&
    orderObj.cookies.length === 0 &&
    orderObj.muffins.length === 0
  ) {
    return [false, "Select atleast one item"];
  }

  // check input type
  else if (/\d/.test(fname) || /\d/.test(lname)) {
    return [false, "Name cannot contain digits"];
  } else if (/[A-Z a-z]/.test(orderObj.c_phno)) {
    return [false, "Phone no cannot contain characters."];
  } else if (
    /[A-Z a-z]/.test(orderObj.cake) ||
    /[A-Z a-z]/.test(orderObj.cookies) ||
    /[A-Z a-z]/.test(orderObj.muffins)
  ) {
    return [false, "Item count cannot contain characters."];
  }

  // check if item selected
  else if (
    Number(orderObj.cake) === 0 &&
    Number(orderObj.cookies) === 0 &&
    Number(orderObj.muffins) === 0
  ) {
    return [false, "Select atleast one item."];
  } else {
    return [true, "Order sent!"];
  }
}

module.exports = validateForm;
