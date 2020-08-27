var express = require("express");
var router = express.Router();

const stripe = require("stripe")(
  "sk_test_51HJgYJH8a6mMDhwuW5Nv64AJw4VHSo36KDpmEMB9NvXW2vaaagtZXM2coeXW6wlhybUEtl9z00sRrVSKj2VJwrfi00DyN21nwW"
);

var setpermission = function (req, res, next) {
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "*");
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
};

/* GET home page. */
router.get("/", setpermission, async function (req, res, next) {
  try {
    const coupons = await stripe.coupons.list({});
    // console.log(coupons);
    res.json({
      status: 1,
      message: "Coupons Retreived Successfully",
      data: coupons.data,
    });
  } catch (ex) {
    res.status(500).json({
      status: 0,
      message: "Some Error Occured",
    });
  }
});

router.post("/", setpermission, async function (req, res, next) {
  console.log(req.body);

  var type = req.body.type == undefined ? "percent" : req.body.type;
  var per_off = req.body.per_off == undefined ? 10 : req.body.per_off;
  var amount_off = req.body.amount_off == undefined ? 10 : req.body.amount_off;
  var duration =
    req.body.duration == undefined ? "repeating" : req.body.duration;
  var d_in_months =
    req.body.d_in_months == undefined ? 3 : req.body.d_in_months;
  var name = req.body.name == undefined ? "Coupon" : req.body.name;

  try {
    var coupon = null;
    if (type == "percent") {
      coupon = await stripe.coupons.create({
        percent_off: per_off,
        duration: duration,
        duration_in_months: d_in_months,
        name: name,
      });
    } else {
      coupon = await stripe.coupons.create({
        amount_off: amount_off,
        duration: duration,
        duration_in_months: d_in_months,
        name: name,
      });
    }

    if (coupon.valid == true) {
      res.json({
        status: 1,
        message: "Coupon Created Successfully",
      });
    } else {
      res.json({
        status: 0,
        message: "Coupon was not created",
      });
    }
  } catch (ex) {
    res.status(500).json({
      status: 0,
      message: "Error Occured",
    });
  }
});

router.delete("/:id", setpermission, async function (req, res, next) {
  console.log(req.body);

  var delId = req.params.id;

  console.log(delId);

  if (delId === undefined) {
    res.status(404).json({
      status: 0,
      message: "No Coupon ID given",
    });
  } else {
    try {
      const deleted = await stripe.coupons.del(delId);

      if (deleted.deleted == true) {
        res.json({
          status: 1,
          message: "Coupon Deleted Successfully",
        });
      }
    } catch (ex) {
      res.json({
        status: 0,
        message: "Some Error Occured",
      });
    }
  }
});

module.exports = router;
